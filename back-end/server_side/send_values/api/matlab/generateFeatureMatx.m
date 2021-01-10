function [featureTable,fs,stims,pix,contact,approach] = generateFeatureMatx(datadirectory,method,lead,contactNum)
% function [featureTable,fs,stims,pix,contact,approach] = generateFeatureMatx(datadirectory,method,contact)
% generate feature matrix based on the entered method (not using built-in functions)
% datadirectory: data directory of the input files
% method: 'max', 'rms', 'peak'
% contact: selected contact used to upload the data file

% Written by Ilknur Telkes,1/5/2020
% telkesi@amc.edu
% Albany Medical College

if ~isempty(contactNum)
    target = ['/EMG_*_P',contactNum, '.mat'];
else
    error(['Enter a valid contact'])
end

% source = strcat(datadirectory,target);
source = strcat(pwd,target);
filesMat = dir(source);
load(filesMat.name);

%     % saturate artifacts above/below threshold
%     for mus=1:size(emgs,3)
%         for cur=1:size(emgs,2)
%             if emgs(:,cur,mus)<-20
%                 emgs(:,cur,mus) = -20;
%             elseif E(k)>20
%                 Eu = 20;
%             else
%                 Eu = E(k);
%             end
%         end
%     end

switch method
    case 'max'
        for mus=1:size(emgs,3)
            for cur=1:size(emgs,2)
                maxVal = abs(squeeze(emgs(1,cur,mus)));
                for m=1:length(emgs)
                    if abs(squeeze(emgs(m,cur,mus))) > maxVal
                        maxVal = abs(squeeze(emgs(m,cur,mus)));
                    end
                end
                Val(cur,mus) = maxVal;
                clear maxVal;
            end
        end
        approach = 'Maximum Peak Amplitude(uV)';
    case 'rms'
        for mus=1:size(emgs,3)
            for cur=1:size(emgs,2)
                rmsVal = sqrt(mean(squeeze(emgs(:,cur,mus)).^2));
                Val(cur,mus) = rmsVal;
                clear rmsVal;
            end
        end
        approach = 'Root Mean Square';
    case 'peak'
        for mus=1:size(emgs,3)
            for cur=1:size(emgs,2)
                % pval = peak2peak(squeeze(emgs(:,cur,mus)),1);
                maxVal = squeeze(emgs(1,cur,mus));
                for m=1:length(emgs)
                    if squeeze(emgs(m,cur,mus)) > maxVal
                        maxVal = squeeze(emgs(m,cur,mus));
                    end
                end
                minVal = squeeze(emgs(1,cur,mus));
                for m=1:length(emgs)
                    if squeeze(emgs(m,cur,mus)) < minVal
                        minVal = squeeze(emgs(m,cur,mus));
                    end
                end
                peakVal = maxVal-minVal;
                Val(cur,mus) = peakVal;
                clear peakVal maxVal minVal;
            end
        end
        approach = 'Peak-to-Peak Amplitude(uV)';
end

fs = 6400/30;
stims = stims';

% creat table and return it to workspace
table_titles = {'current(mA)';'LADD';'LAH';'LBF';'LGLUT';'LLAB';'LMG';'LQUAD';'LTA';'LUAB';'RADD';'RAH';'RBF';'RGLUT';'RLAB';'RMG';'RQUAD';'RTA';'RUAB'};
featureTable = array2table([stims,Val],'VariableNames',table_titles);

clear fileName SR Fs emgs muscles Val index mus cur table_titles;
end


