% EMG Heatmaps

% Written by Ilknur Telkes
% telkesi@amc.edu
% Albany Medical College

%% upload the data into workspace
directory = '';    % enter the directory of your data and image
load('directory\data.mat')
%% plot
temp = case1;

figure
img = imread('directory\human.jpg');
pos = zeros(1204,1000); % i defined a matrix for the muscle positions

% Muscle Positions y-x
%front mid:247
pos(430,224) = temp(17,2); % R upper abs
pos(471,224) = temp(18,2); % R lower abs
pos(744,227) = temp(11,2); % R adductor magnus
pos(723,153) = temp(12,2); % R vastus lateralis
pos(965,181) = temp(15,2); % R tibialis anterior
pos(1172,216) = temp(10,2); % R adductor hallucis
% % rear mid:744
pos(624,790) = temp(13,2); % R gluteus maximus
pos(955,809) = temp(16,2); % R medial gastroc
pos(714,773) = temp(11,2); % R adductor magnus
pos(738,825) = temp(14,2); % R bicep femoris

pos(430,270) = temp(8,1); % L upper abs
pos(471,270) = temp(9,1); % L lower abs
pos(744,267) = temp(2,1); % L adductor magnus
pos(723,341) = temp(3,1); % L vastus lateralis
pos(965,313) = temp(6,1); % L tibialis anterior
pos(1172,278) = temp(1,1); % L adductor hallucis
% rear mid:744
pos(624,698) = temp(4,1); % L gluteus maximus
pos(955,679) = temp(7,1); % L medial gastroc
pos(714,715) = temp(2,1); % L adductor magnus
pos(738,663) = temp(5,1); % L bicep femoris

% Generate the density map
gaussian_kernel = fspecial('gaussian', [100 100], 20);
density = imfilter(pos, gaussian_kernel, 'replicate');

% Generate the heat map
omask = heatmap_overlay(img, density, 'jet');

% heat map
imshow(omask,[]);
colormap(jet);

colorbar;
title('Case-1 EMG Heat Map','FontSize',12,'FontWeight','Bold');
htR = text(1,7,'R');
set(htR, 'Position',[130 160 0],'FontSize',13,'FontWeight','Bold')
htL = text(1,7,'L');
set(htL, 'Position',[330 160 0],'FontSize',13,'FontWeight','Bold')
htR2 = text(1,7,'R');
set(htR2, 'Position',[820 160 0],'FontSize',13,'FontWeight','Bold')
htL2 = text(1,7,'L');
set(htL2, 'Position',[638 160 0],'FontSize',13,'FontWeight','Bold')

% plot dots x-y !!
hold on
dotpos = [430 224;471 224;430 270;471 270;744 227;744 267;723 153;723 341;...
    965 181;965 313;1172 216;1172 278;624 698;624 790;955 679;955 809;...
    714 715;714 773;738 663;738 825];
plot(dotpos(:,2),dotpos(:,1),'*','color',[0 0 0],'markersize',6,'linewidth',1);

clear temp dotpos htR htR2 htL htL2 omask pos density gaussian_kernel