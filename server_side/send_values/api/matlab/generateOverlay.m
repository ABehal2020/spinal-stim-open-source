function [density,img] = generateOverlay(data,side,imageDir)
% function [density,img] = generateOverlay(data,side,imageDir)
% data: values to plot
% side to plot: 'left', 'right', 'full'
% imageDir: image directory

% Written by Ilknur Telkes,1/5/2021
% telkesi@amc.edu
% Albany Medical College

img = imread(strcat(imageDir,'/human.jpg'));
pos = zeros(1204,1000);

if strcmp(lower(side),'left')
    % Muscle Positions y-x
    % front mid:247
    pos(430,314) = data(9); % L upper abs
    pos(471,314) = data(5); % L lower abs
    pos(744,267) = data(1); % L adductor magnus
    pos(723,341) = data(7); % L vastus lateralis
    pos(965,313) = data(8); % L tibialis anterior
    pos(1172,278) = data(2); % L adductor hallucis
    % rear mid:744
    pos(624,698) = data(4); % L gluteus maximus
    pos(955,679) = data(6); % L medial gastroc
    pos(738,663) = data(3); % L bicep femoris
    
elseif strcmp(lower(side),'right')
    pos(430,180) = data(18); % R upper abs
    pos(471,180) = data(14); % R lower abs
    pos(744,227) = data(10); % R adductor magnus
    pos(723,153) = data(16); % R vastus lateralis
    pos(965,181) = data(17); % R tibialis anterior
    pos(1172,216) = data(11); % R adductor hallucis
    pos(624,790) = data(13); % R gluteus maximus
    pos(955,809) = data(15); % R medial gastroc
    pos(738,825) = data(12); % R bicep femoris
    
elseif strcmp(lower(side),'full')
    pos(430,180) = data(18); % R upper abs
    pos(471,180) = data(14); % R lower abs
    pos(744,227) = data(10); % R adductor magnus
    pos(723,153) = data(16); % R vastus lateralis
    pos(965,181) = data(17); % R tibialis anterior
    pos(1172,216) = data(11); % R adductor hallucis
    pos(624,790) = data(13); % R gluteus maximus
    pos(955,809) = data(15); % R medial gastroc
    pos(738,825) = data(12); % R bicep femoris
  
    pos(430,314) = data(9); % L upper abs
    pos(471,314) = data(5); % L lower abs
    pos(744,267) = data(1); % L adductor magnus
    pos(723,341) = data(7); % L vastus lateralis
    pos(965,313) = data(8); % L tibialis anterior
    pos(1172,278) = data(2); % L adductor hallucis
    pos(624,698) = data(4); % L gluteus maximus
    pos(955,679) = data(6); % L medial gastroc
    pos(738,663) = data(3); % L bicep femoris
end

% Smooth image
density = imgaussfilt(pos,20,'Padding','replicate');
end

