% Heat map generation Script
% create feature matrix
% method: 'max', 'rms', 'peak'
load("user_input.mat");
% [featureTable,fs,stims,pix,contact,approach] = generateFeatureMatx('/Users/adityabehal/Desktop/spinal-stim/server_side/send_values/api/matlab',signalingProcMethod,'microleads',contactNum);
[featureTable,fs,stims,pix,contact,approach] = generateFeatureMatx('',signalingProcMethod,'microleads',contactNum);

%% convert table to data
feature = table2array(featureTable);
feature(:,1) = [];
muscles={'LADD';'LAH';'LBF';'LGLUT';'LLAB';'LMG';'LQUAD';'LTA';'LUAB';'RADD';'RAH';'RBF';'RGLUT';'RLAB';'RMG';'RQUAD';'RTA';'RUAB'};

%% normalization
%[ndata] = normalizeEMG(data,selectedCurrent,stims,method)
% method: 1:baseline in dB, 2:baseline %, 3: min-max, 4:group avg, 5: raw
selectedCurrent = currentVal;

if normalizationMethod == "dB"
    method = 1;
elseif normalizationMethod == "percentage"
    method = 2;
elseif normalizationMethod == "min"
    method = 3;
elseif normalizationMethod == "group"
    method = 4;
elseif normalizationMethod == "no"
    method = 5;
end

[ndata,method] = normalizeEMG(feature,selectedCurrent,stims,method);

%% generate overlap image
% [density, img] = generateOverlay(data,side,imageDir)
side = bodySide; % 'left','right','full'
[density,img] = generateOverlay(ndata,side,pwd);
% [density,img] = generateOverlay(ndata,side,'./');

%% ploting 2 images on top of each other
selectedColorMap = colormapOption; %'jet','gray','hot','parula'
plotHeatMap(img,density,selectedColorMap,contact,side,selectedCurrent,method,approach,muscles,'yes',jobID);

