function plotHeatMap(img,density,colMap,contact,side,selectedCurrent,method,approach,muscles,showInfo,jobID)
% function plotHeatMap(img,density,colMap,contact,side,selectedCurrent,method,approach,muscles,showInfo)
% img: body image
% density: map
% colMap: colormap. 'jet','gray','hot','parula'
% contact: selected lead channel
% side: side of the body to monitor
% selectedCurrent: SCS current
% method: normalization method
% approach: feature
% muscles: abbreviations
% showInfo: show muscle names. 'yes', 'no'

% Written by Ilknur Telkes,1/5/2021
% telkesi@amc.edu
% Albany Medical College

figure
set(gcf,'position',[680   127   888   851]);
ha = tight_subplot(1,2,[0.08 0.03],[0.08 0.08],[.03 .01]);
axes(ha(1))
set(gca,'position',[0.0199    0.1198    0.6614    0.8742]);

alpha = (~isnan(density))*0.6;
imshow(img)
hold on
OverlayImage = imshow(density);
%caxis([-0.01 0.02])    % you can play with the scale 
caxis('auto')

% dimensions of colormapOption and masking must be equal
switch colMap
    case 'jet'
        colormapOption = jet(256);
    case 'gray'
        colormapOption = gray(256);
    case 'hot'
        colormapOption = hot(256);
    case 'parula'
        colormapOption = parula(256);
end

[masking,zeroRGB] = bluewhitered(256);

for r = 1:size(colormapOption,1)
    % row 205 is discontinuous in the color gradient so it is being
    % preserved by accounting for it in the if statement below (this
    % assumes that the default value of 256 is going to be used all the
    % time for the initialization of colormapOption and masking)
    if (masking(r,1) ~= zeroRGB(1) && masking(r,1) ~= zeroRGB(2) && masking(r,1) ~= zeroRGB(3)) || r == 205
        masking(r,1) = colormapOption(r,1);
        masking(r,2) = colormapOption(r,2);
        masking(r,3) = colormapOption(r,3);
    end
end

cm = colormap(OverlayImage.Parent, masking);
cb = colorbar(OverlayImage.Parent);
set(cb,'Location','south')
set(cb,'Position',[0.0312    0.0638    0.6370    0.0251]);
set(OverlayImage,'AlphaData',alpha);

    titleName = {['Selected Parameters:']
        [' ']
        ['Stimulation at ',num2str(selectedCurrent),'mA']
        ['Other SCS parameters: 60Hz/300us']
        ['Normalization: ',method]
        ['Contact: ',contact]
        ['Body: ',side]
        ['Feature: ',approach]
        ['Color map: ',colMap]
        ['Original Job ID: ',jobID]};
    
    tt = text(1,7,titleName);
    set(tt, 'Position',[1000 150 0],'FontSize',11,'FontWeight','Bold')
    hold on
    
    musNames = {'LADD:Left Adductor magnus';
        'LAH:Left Adductor hallucis';
        'LBF:Left Bicep femoris';
        'LGLUT:Left Gluteus maximus';
        'LLAB:Left Lower abs';
        'LMG:Left Medial gastroc';
        'LQUAD:Left Vastus group(Quads)';
        'LTA:Left Tibialis anterior';
        'LUAB:Left Upper abs'
        'RADD:Right Adductor magnus';
        'RAH:Right Adductor hallucis';
        'RBF:Right Bicep femoris';
        'RGLUT:Right Gluteus maximus';
        'RLAB:Right Lower abs';
        'RMG:Right Medial gastroc';
        'RQUAD:Right Vastus group(Quads)';
        'RTA:Right Tibialis anterior';
        'RUAB:Right Upper abs'};

if strcmp(side,'full')
    line([245 245],[0 1204],'linestyle','--','color','k','linewidth',1);
    line([744 744],[0 1204],'linestyle','--','color','k','linewidth',1);
    
    % labels
    ant = text(1,7,'Anterior');
    set(ant, 'Position',[195 1230 0],'FontSize',13,'FontWeight','Bold')
    post = text(1,7,'Posterior');
    set(post, 'Position',[690 1230 0],'FontSize',13,'FontWeight','Bold')
    htR = text(1,7,'R');
    set(htR, 'Position',[130 160 0],'FontSize',13,'FontWeight','Bold')
    htL = text(1,7,'L');
    set(htL, 'Position',[330 160 0],'FontSize',13,'FontWeight','Bold')
    htR2 = text(1,7,'R');
    set(htR2, 'Position',[820 160 0],'FontSize',13,'FontWeight','Bold')
    htL2 = text(1,7,'L');
    set(htL2, 'Position',[638 160 0],'FontSize',13,'FontWeight','Bold')
    
    % plot muscle points
    dotpos = [430 180;...
        471 180;...
        430 314;...
        471 314;...
        744 227;...
        744 267;...
        723 153;...
        723 341;...
        965 181;...
        965 313;...
        1172 216;...
        1172 278;...
        624 698;...
        624 790;...
        955 679;...
        955 809;...
        738 663;...
        738 825];
    plot(dotpos(:,2),dotpos(:,1),'*','color',[0 0 0],'markersize',6,'linewidth',1);
    
    
    % plot muscle names
    % 'LADD';'LAH';'LBF';'LGLUT';'LLAB';'LMG';'LQUAD';'LTA';'LUAB';
    muspos = [348 800 0;...
        352 1174 0;...
        568 740 0;...
        529 554 0;...
        392 481 0;...
        556 950 0;...
        402 750 0
        387 965 0;...
        392 428 0;...
        29 800 0;...
        90 1174 0;...
        885 740 0;...
        879 554 0;...
        23 481 0;...
        875 950 0;...
        38 750 0
        50 965 0;...
        23 428 0];
   
    if strcmp(showInfo,'yes')
        ii=1;
        for ms=1:18
            htabb = text(1,7,muscles(ms));
            set(htabb, 'Position',[muspos(ms,1) muspos(ms,2) muspos(ms,3)],'FontSize',11);
            htmus = text(1,7,musNames(ms));
            set(htmus, 'Position',[1000 350+ii 0],'FontSize',11,'FontWeight','Bold');
            ii = ii+50;
            clear htabb htmus;
        end
    end
elseif strcmp(side,'right')
    line([245 245],[0 1204],'linestyle','--','color','k','linewidth',1);
    line([744 744],[0 1204],'linestyle','--','color','k','linewidth',1);
    
    % labels
    ant = text(1,7,'Anterior');
    set(ant, 'Position',[195 1230 0],'FontSize',13,'FontWeight','Bold')
    post = text(1,7,'Posterior');
    set(post, 'Position',[690 1230 0],'FontSize',13,'FontWeight','Bold')
    htR = text(1,7,'R');
    set(htR, 'Position',[130 160 0],'FontSize',13,'FontWeight','Bold')
    htR2 = text(1,7,'R');
    set(htR2, 'Position',[820 160 0],'FontSize',13,'FontWeight','Bold')
    
    % plot dots x-y !!
    % front mid:247
    % rear mid:744
    dotpos =[430 180;...
        471 180;...
        744 227;...
        723 153;...
        965 181;...
        1172 216;...
        624 790;...
        955 809;...
        738 825];
    plot(dotpos(:,2),dotpos(:,1),'*','color',[0 0 0],'markersize',6,'linewidth',1);
    
    % plot muscle names
    % 'LADD';'LAH';'LBF';'LGLUT';'LLAB';'LMG';'LQUAD';'LTA';'LUAB';
    muspos = [29 800 0;...
        90 1174 0;...
        885 740 0;...
        879 554 0;...
        23 481 0;...
        875 950 0;...
        38 750 0
        50 965 0;...
        23 428 0];
   
    if strcmp(showInfo,'yes')
        ii=1;
        for ms=1:9
            htabb = text(1,7,muscles(ms+9));
            set(htabb, 'Position',[muspos(ms,1) muspos(ms,2) muspos(ms,3)],'FontSize',11);
            htmus = text(1,7,musNames(ms+9));
            set(htmus, 'Position',[1000 400+ii 0],'FontSize',11,'FontWeight','Bold');
            ii = ii+50;
            clear htabb htmus;
        end
    end
    
elseif strcmp(side,'left')
    line([245 245],[0 1204],'linestyle','--','color','k','linewidth',1);
    line([744 744],[0 1204],'linestyle','--','color','k','linewidth',1);
    
    % labels
    ant = text(1,7,'Anterior');
    set(ant, 'Position',[195 1230 0],'FontSize',13,'FontWeight','Bold')
    post = text(1,7,'Posterior');
    set(post, 'Position',[690 1230 0],'FontSize',13,'FontWeight','Bold')
    htL = text(1,7,'L');
    set(htL, 'Position',[330 160 0],'FontSize',13,'FontWeight','Bold')
    htL2 = text(1,7,'L');
    set(htL2, 'Position',[638 160 0],'FontSize',13,'FontWeight','Bold')
    
    % plot dots x-y !!
    % front mid:247
    % rear mid:744
    dotpos =[430 314;...
        471 314;...
        723 341;...
        744 267;...
        965 313;...
        1172 278;...
        955 679;...
        624 698;...
        738 663];
    plot(dotpos(:,2),dotpos(:,1),'*','color',[0 0 0],'markersize',6,'linewidth',1);
    
    % plot muscle names
    % 'LADD';'LAH';'LBF';'LGLUT';'LLAB';'LMG';'LQUAD';'LTA';'LUAB';
    muspos = [348 800 0;...
        352 1174 0;...
        568 740 0;...
        529 554 0;...
        392 481 0;...
        556 950 0;...
        402 750 0
        387 965 0;...
        392 428 0];
    
    if strcmp(showInfo,'yes')
        ii=1;
        for ms=1:9
            htabb = text(1,7,muscles(ms));
            set(htabb, 'Position',[muspos(ms,1) muspos(ms,2) muspos(ms,3)],'FontSize',11);
            htmus = text(1,7,musNames(ms));
            set(htmus, 'Position',[1000 400+ii 0],'FontSize',11,'FontWeight','Bold');
            ii = ii+50;
            clear htabb htmus;
        end
    end
end

axes(ha(2))
delete(gca)

% % save it to .svg
% fileName = strcat('case_',num2str(pix),'_',approach,'_','side_',side,'_',contact,'_1.svg');
% saveas(gcf,fileName);

% fileName = strcat('/Users/adityabehal/Desktop/spinal-stim/server_side/send_values/api/results/', jobID, '.svg');
fileName = strcat('../results/', jobID, '.svg');
saveas(gcf,fileName);

end

