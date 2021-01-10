function [ndata,metd] = normalizeEMG(data,selectedCurrent,stims,method)
% function [ndata,metd] = normalizeEMG(data,selectedCurrent,stims,method)
% normalize selected current values across muscles
% data: feature matrix
% selectedCurrent: current to be plot
% stims: current vector
% method: 1:baseline in dB, 2:baseline %, 3: min-max, 4:group, 5: raw
% lead: type of lead tested

% Written by Ilknur Telkes,1/5/2020
% telkesi@amc.edu
% Albany Medical College

if method==1 % baseline in dB
    idx = find(stims==0);
    lowx = find(idx<10);
    base = mean(data(lowx,:),1);
    clear idx lowx;
    
    % find closest value btw stims vector and selected current
    [~, closestIndex] = min(abs(stims-selectedCurrent));
    idx = find(stims==stims(closestIndex)); % if there are multiple
    if length(idx)>1
        curr = mean(data(idx,:),1);
    else
        curr = data(idx,:);
    end
    % normalize and convert to dB
    ndata = 20*log10(curr./(base));
    metd = 'OFF-to-ON Change(dB)';
    
elseif method==2 % percentage wrt baseline
    idx = find(stims==0);
    lowx = find(idx<10);
    base = mean(data(lowx,:),1);
    clear idx lowx;
    
    % find closest value btw stims vector and selected current
    [~, closestIndex] = min(abs(stims-selectedCurrent));
    idx = find(stims==stims(closestIndex)); % if there are multiple
    if length(idx)>1
        curr = mean(data(idx,:),1);
    else
        curr = data(idx,:);
    end
    % raw
    ndata = ((curr-base)./base)*100;
    metd = 'OFF-to-ON Change(%)';
     
elseif method==3 % min-max normalization
    [~, closestIndex] = min(abs(stims-selectedCurrent));
    idx = find(stims==stims(closestIndex)); % if there are multiple
    if length(idx)>1
        curr = mean(data(idx,:),1);
    else
        curr = data(idx,:);
    end
    % normalize to average of all muscles
    ndata = (curr-min(curr))./(max(curr)-min(curr));
    metd = 'Min-Max(uV)';
     
elseif method==4 % group normalization 
    [~, closestIndex] = min(abs(stims-selectedCurrent));
    idx = find(stims==stims(closestIndex)); % if there are multiple
    if length(idx)>1
        curr = mean(data(idx,:),1);
    else
        curr = data(idx,:);
    end
    % normalize to average of all muscles
    ndata = 20*log10(curr./(mean(curr)));
    metd = 'Group average(dB)';
    
elseif method==5 % raw
    % find closest value btw stims vector and selected current
    [~, closestIndex] = min(abs(stims-selectedCurrent));
    idx = find(stims==stims(closestIndex)); % if there are multiple
    if length(idx)>1
        curr = mean(data(idx,:),1);
    else
        curr = data(idx,:);
    end
    % raw
    ndata = curr;
    metd = 'No normalization';
end

end

