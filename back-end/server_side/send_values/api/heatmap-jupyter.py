#!/usr/bin/env python
# coding: utf-8

# In[81]:


def envpeak(x,n):
    import numpy as np
    from scipy.signal import find_peaks
    import scipy
    # pre-allocate space for results
    nx = x.size
    yupper = np.zeros(nx);
    # handle default case where not enough input is given
    if nx<2:
        yupper=x
        lupper=x
    # compute upper envelope
    if nx>n:
        # find local maxima separated by at least N samples
        ipk = find_peaks(x,distance=3)[0];
    else: ipk=[];
    if ipk.size<2:
        ilocs=[1,ipk,nx]
    else: ilocs=ipk;
    fill=np.arange(0,nx,1)
    from scipy import interpolate
    # smoothly connect the maxima via a spline.
    f = interpolate.interp1d(ilocs,x[ilocs],fill_value='extrapolate',kind='cubic')
    yupper=f(fill)
    #delete this part
  #  print('this is the upper peak envelope:')
   # print(yupper)
    #up to here
    return yupper
    
    


# In[82]:


def omitOutliers(emgs):   
    import numpy as np
    import math
    denoisedEmgs = np.zeros(emgs.shape)
    for mus in range(0,emgs[0][0].size):
                for cur in range(0,int(emgs[0].size/emgs[0][0].size)):
                     signal=emgs[:,cur,mus]
                     asignal = abs(signal); # rectified signal
                     yup=envpeak(asignal,2)
                     loc=scipy.signal.find_peaks(yup)[0]
                     pk=yup[loc]
                     thr = np.mean(pk)+(np.mean(pk)*0.10);
                     x,=np.where(pk>thr);
                     if len(x)>0:
                            for k in range(0,len(x)):
                                if loc[x[k]]<11:
                                    moveL=loc[x[k]]-1
                                else: moveL=10

                                if loc[x[k]]>629:
                                    moveR=len(asignal)-loc[x[k]]
                                else: moveR=10
                                asignal[loc[x[k]]-moveL:loc[x[k]]+moveR]=math.nan    
                     denoisedEmgs[:,cur,mus] = asignal
                    
    #delete this part
  #  print('this is the denoised EMgs:')
  #  print(denoisedEmgs)
    #up to here
    return denoisedEmgs;


# In[83]:


def generateFeatureMatx(matDir,method,contact,caseNum):
    import pandas as pd
    import math
    import statistics
#function [featureTable,fs,stims,contactNum,caseNumber,approach] = generateFeatureMatx(datadirectory,method,contactNum,caseNumber)
# generate feature matrix based on the entered method (not using built-in functions)
# datadirectory: data directory of the input files
# method: 'max', 'rms', 'peak'
# contact: selected contact used to upload the data file. e.g., 5
# caseNumber: select the entered subject/case. e.g., 4

    if contactNum is not None and caseNumber is not None:
        # target=matDir+'\EMG_data_case_'+str(caseNumber)+'_P'+str(contactNum)+'.mat'
        target=matDir+'EMG_data_case_'+str(caseNumber)+'_P'+str(contactNum)+'.mat'
    elif contactNum is None:
        print('Enter a valid contact')
        sys.exit()
    elif caseNumber is None:
        print('Enter a valid case number')
        sys.exit()
    source = str(target);
    #filesMat = dir(source);
    #load(target+"EMG_data_case_4_P1.mat");
    
    from scipy.io import loadmat
    #x = loadmat('c:\ilknurmatlab\EMG_data_case_4_P1.mat',squeeze_me=True, struct_as_record=False)
    x=loadmat(target,squeeze_me=True,struct_as_record=False)
    Fs=x['Fs']
    pix=x['pix']
    stims=x['stims']
    muscles=x['muscles']
    index=x['index']
    files=x['files']
    emgs=x['emgs']
    
   
    # remove outliers
    denoisedEmgs = omitOutliers(emgs);
    Val = [[0]*emgs[0][0].size]*int(emgs[0].size/emgs[0][0].size)
    Val=np.single(Val)
    if method=='max':
            for mus in range(0,emgs[0][0].size):
                for cur in range(0,int(emgs[0].size/emgs[0][0].size)):
                    temp=denoisedEmgs[:,cur,mus]
                    omitSignal = temp[~np.isnan(temp)]
                    maxVal=np.max(omitSignal)
                    Val[cur,mus]=maxVal
            approach='Maximum Peak Amp.';
    elif method=='rms':
            for mus in range(0,emgs[0][0].size):
                for cur in range(0,int(emgs[0].size/emgs[0][0].size)):
                    temp=denoisedEmgs[:,cur,mus]
                    omitSignal = temp[~np.isnan(temp)]
                    rmsVal=np.sqrt(np.mean(omitSignal**2))
                    Val[cur,mus]=rmsVal
            approach='Root Mean Square';       
    elif method=='peak':
            for mus in range(0,emgs[0][0].size):
                for cur in range(0,int(emgs[0].size/emgs[0][0].size)):
                    temp=denoisedEmgs[:,cur,mus]
                    omitSignal = temp[~np.isnan(temp)]
                    peakVal=np.ptp(omitSignal)
                    Val[cur,mus]=peakVal
            approach='Peak-to-Peak Amp.';  
    fs = 6400/30;
    df1 = pd.DataFrame(Val)
    df2 = pd.DataFrame(stims)
    featureTable=pd.concat([df2,df1],axis=1)
    featureTable.columns =['current','LADD','LAH','LBF','LGLUT','LLAB','LMG','LQUAD','LTA','LUAB','RADD','RAH','RBF','RGLUT','RLAB','RMG','RQUAD','RTA','RUAB']
    
    #delete this part
  #  print('this is data feature:')
   # print(featureTable)
    #up to here
    return featureTable,fs,stims,contact,caseNum,approach


# In[84]:


def normalizeEMG(data,selectedCurrent,stims,method):
# function [ndata,metd,scale] = normalizeEMG(data,selectedCurrent,stims,method)
# normalize selected current values across muscles
# data: feature matrix
# selectedCurrent: current to be plot
# stims: current vector
# method: 1:baseline in dB, 2:baseline %, 3: min-max, 4:group, 5: raw
    import math
    if method==1: #baseline in dB
        idx = np.argwhere(stims==0)
        lowx2 = np.argwhere(idx<10);
        lowx = [el[0] for el in lowx2]
        base = data.iloc[lowx,:].mean(axis=0)
        base=np.asarray(base)
        del idx, lowx;
    # find closest value btw stims vector and selected current        
        values=list(abs(stims-selectedCurrent))
        closestIndex=values.index(min(values))
        idx=np.where(stims==stims[closestIndex])
        if len(idx)>1:
            curr=data.iloc[idx,:].mean(axis=0)
            curr=np.asarray(curr)
        else: 
            curr=data.iloc[idx]
            curr=np.asarray(curr)
        #normalize and convert to dB    
        ndata=20*np.log10(curr/base)
        methodName = 'OFF-to-ON Change';
        scale = [np.min(ndata), np.max(ndata)];
        
    elif method==2: # percentage wrt baseline
        idx = np.argwhere(stims==0)
        lowx2 = np.argwhere(idx<10);
        lowx = [el[0] for el in lowx2]
        base = data.iloc[lowx,:].mean(axis=0)
        base=np.asarray(base)
        del idx, lowx;
    # find closest value btw stims vector and selected current        
        values=list(abs(stims-selectedCurrent))
        closestIndex=values.index(min(values))
        idx=np.where(stims==stims[closestIndex])
        if len(idx)>1:
            curr=data.iloc[idx,:].mean(axis=0)
            curr=np.asarray(curr)
        else: 
            curr=data.iloc[idx]
            curr=np.asarray(curr)
        #raw   
        ndata=(curr-base)/base*100
        methodName = 'OFF-to-ON Change';
        scale = [0, 100];        
    
    elif method==3: #min-max normalization
    #find closest value btw stims vector and selected current
        values=list(abs(stims-selectedCurrent))
        closestIndex=values.index(min(values))
        idx=np.where(stims==stims[closestIndex])
        if len(idx)>1:
            curr=data.iloc[idx,:].mean(axis=0)
            curr=np.asarray(curr)
        else: 
            curr=data.iloc[idx]
            curr=np.asarray(curr)
        # normalize to average of all muscles    
        ndata = (curr-np.min(curr))/(np.max(curr)-np.min(curr));
        methodName = 'Min-Max';
        scale = [0,1];     
    
    elif method==4: #group normalization 
    #find closest value btw stims vector and selected current
        values=list(abs(stims-selectedCurrent))
        closestIndex=values.index(min(values))
        idx=np.where(stims==stims[closestIndex])
        if len(idx)>1:
            curr=data.iloc[idx,:].mean(axis=0)
            curr=np.asarray(curr)
        else: 
            curr=data.iloc[idx]
            curr=np.asarray(curr)
        #normalize to average of all muscles    
        ndata = 20*np.log10(curr/(np.mean(curr)));
        methodName = 'Group average';
        scale = [np.min(ndata),np.max(ndata)];
    
    elif method==5: #raw
    #find closest value btw stims vector and selected current
        values=list(abs(stims-selectedCurrent))
        closestIndex=values.index(min(values))
        idx=np.where(stims==stims[closestIndex])
        if len(idx)>1:
            curr=data.iloc[idx,:].mean(axis=0)
            curr=np.asarray(curr)
        else: 
            curr=data.iloc[idx]
            curr=np.asarray(curr)
        #raw    
        ndata = curr
        methodName = 'No normalization';
        scale = [np.min(ndata),np.max(ndata)];
            
    #delete this part
  #  print('this is the normalized data:')
   # print(ndata)
    #up to here
    return ndata,method,methodName,scale



# In[85]:


def generateOverlay(data,side,imageDir):
#[density,img] = generateOverlay(data,side,imageDir)
# data: values to plot
# body side to plot: 'left', 'right', 'full'
# imageDir: image directory
    import matplotlib
    import matplotlib.pyplot as plt 
    # imageDir='c:\ilknurmatlab'
    imageDir = '/Users/adityabehal/Downloads/'
    # img = plt.imread(imageDir+'\human.jpg', format=None)
    img = plt.imread(imageDir+'human.jpg', format=None)
    pos = np.zeros((1204,1000)); # based on 'human.jpg'
    span = 25;
    
    if side=='left':
        pos[430-span:430+span,314-span:314+span] = data[0,8]; # L upper abs
        pos[471-span:471+span,314-span:314+span] = data[0,4]; # L lower abs
        pos[744-span:744+span,267-span:267+span] = data[0,0]; # L adductor magnus
        pos[723-span:723+span,341-span:341+span] = data[0,6]; # L vastus lateralis
        pos[965-span:965+span,313-span:313+span] = data[0,7]; # L tibialis anterior
        pos[1172-span:1172+span,278-span:278+span] = data[0,1]; # L adductor hallucis
        pos[624-span:624+span,698-span:698+span] = data[0,3]; # L gluteus maximus
        pos[955-span:955+span,679-span:679+span] = data[0,5]; # L medial gastroc
        pos[738-span:738+span,663-span:663+span] = data[0,2]; # L bicep femoris
        
    elif side=='right':
        pos[430-span:430+span,180-span:180+span] = ndata[0,17]; # R upper abs
        pos[471-span:471+span,180-span:180+span] = ndata[0,13]; # R lower abs
        pos[744-span:744+span,227-span:227+span] = ndata[0,9]; # R adductor magnus
        pos[723-span:723+span,153-span:153+span] = ndata[0,15]; # R vastus lateralis
        pos[965-span:965+span,181-span:181+span] = ndata[0,16]; # R tibialis anterior
        pos[1172-span:1172+span,216-span:216+span] = ndata[0,10]; # R adductor hallucis
        pos[624-span:624+span,790-span:790+span] = ndata[0,12]; # R gluteus maximus
        pos[955-span:955+span,809-span:809+span] = ndata[0,14]; # R medial gastroc
        pos[738-span:738+span,825-span:825+span] = ndata[0,11]; # R bicep femoris
    
    elif side=='full':
        pos[430-span:430+span,180-span:180+span] = ndata[0,17]; # R upper abs
        pos[471-span:471+span,180-span:180+span] = ndata[0,13]; # R lower abs
        pos[744-span:744+span,227-span:227+span] = ndata[0,9]; # R adductor magnus
        pos[723-span:723+span,153-span:153+span] = ndata[0,15]; # R vastus lateralis
        pos[965-span:965+span,181-span:181+span] = ndata[0,16]; # R tibialis anterior
        pos[1172-span:1172+span,216-span:216+span] = ndata[0,10]; # R adductor hallucis
        pos[624-span:624+span,790-span:790+span] = ndata[0,12]; # R gluteus maximus
        pos[955-span:955+span,809-span:809+span] = ndata[0,14]; # R medial gastroc
        pos[738-span:738+span,825-span:825+span] = ndata[0,11]; # R bicep femoris
 
        pos[430-span:430+span,314-span:314+span] = data[0,8]; # L upper abs
        pos[471-span:471+span,314-span:314+span] = data[0,4]; # L lower abs
        pos[744-span:744+span,267-span:267+span] = data[0,0]; # L adductor magnus
        pos[723-span:723+span,341-span:341+span] = data[0,6]; # L vastus lateralis
        pos[965-span:965+span,313-span:313+span] = data[0,7]; # L tibialis anterior
        pos[1172-span:1172+span,278-span:278+span] = data[0,1]; # L adductor hallucis
        pos[624-span:624+span,698-span:698+span] = data[0,3]; # L gluteus maximus
        pos[955-span:955+span,679-span:679+span] = data[0,5]; # L medial gastroc
        pos[738-span:738+span,663-span:663+span] = data[0,2]; # L bicep femoris
        
    density=scipy.ndimage.gaussian_filter(pos,sigma=2,mode='nearest')
    #delete this part
  #  print('this is data squares following gaussian filter')
  #  print(density)
    #up to here    
    return density,img;


# In[86]:


####defining Parula Colormap

from matplotlib.colors import LinearSegmentedColormap

cm_data = [[0.2081, 0.1663, 0.5292], [0.2116238095, 0.1897809524, 0.5776761905], 
 [0.212252381, 0.2137714286, 0.6269714286], [0.2081, 0.2386, 0.6770857143], 
 [0.1959047619, 0.2644571429, 0.7279], [0.1707285714, 0.2919380952, 
  0.779247619], [0.1252714286, 0.3242428571, 0.8302714286], 
 [0.0591333333, 0.3598333333, 0.8683333333], [0.0116952381, 0.3875095238, 
  0.8819571429], [0.0059571429, 0.4086142857, 0.8828428571], 
 [0.0165142857, 0.4266, 0.8786333333], [0.032852381, 0.4430428571, 
  0.8719571429], [0.0498142857, 0.4585714286, 0.8640571429], 
 [0.0629333333, 0.4736904762, 0.8554380952], [0.0722666667, 0.4886666667, 
  0.8467], [0.0779428571, 0.5039857143, 0.8383714286], 
 [0.079347619, 0.5200238095, 0.8311809524], [0.0749428571, 0.5375428571, 
  0.8262714286], [0.0640571429, 0.5569857143, 0.8239571429], 
 [0.0487714286, 0.5772238095, 0.8228285714], [0.0343428571, 0.5965809524, 
  0.819852381], [0.0265, 0.6137, 0.8135], [0.0238904762, 0.6286619048, 
  0.8037619048], [0.0230904762, 0.6417857143, 0.7912666667], 
 [0.0227714286, 0.6534857143, 0.7767571429], [0.0266619048, 0.6641952381, 
  0.7607190476], [0.0383714286, 0.6742714286, 0.743552381], 
 [0.0589714286, 0.6837571429, 0.7253857143], 
 [0.0843, 0.6928333333, 0.7061666667], [0.1132952381, 0.7015, 0.6858571429], 
 [0.1452714286, 0.7097571429, 0.6646285714], [0.1801333333, 0.7176571429, 
  0.6424333333], [0.2178285714, 0.7250428571, 0.6192619048], 
 [0.2586428571, 0.7317142857, 0.5954285714], [0.3021714286, 0.7376047619, 
  0.5711857143], [0.3481666667, 0.7424333333, 0.5472666667], 
 [0.3952571429, 0.7459, 0.5244428571], [0.4420095238, 0.7480809524, 
  0.5033142857], [0.4871238095, 0.7490619048, 0.4839761905], 
 [0.5300285714, 0.7491142857, 0.4661142857], [0.5708571429, 0.7485190476, 
  0.4493904762], [0.609852381, 0.7473142857, 0.4336857143], 
 [0.6473, 0.7456, 0.4188], [0.6834190476, 0.7434761905, 0.4044333333], 
 [0.7184095238, 0.7411333333, 0.3904761905], 
 [0.7524857143, 0.7384, 0.3768142857], [0.7858428571, 0.7355666667, 
  0.3632714286], [0.8185047619, 0.7327333333, 0.3497904762], 
 [0.8506571429, 0.7299, 0.3360285714], [0.8824333333, 0.7274333333, 0.3217], 
 [0.9139333333, 0.7257857143, 0.3062761905], [0.9449571429, 0.7261142857, 
  0.2886428571], [0.9738952381, 0.7313952381, 0.266647619], 
 [0.9937714286, 0.7454571429, 0.240347619], [0.9990428571, 0.7653142857, 
  0.2164142857], [0.9955333333, 0.7860571429, 0.196652381], 
 [0.988, 0.8066, 0.1793666667], [0.9788571429, 0.8271428571, 0.1633142857], 
 [0.9697, 0.8481380952, 0.147452381], [0.9625857143, 0.8705142857, 0.1309], 
 [0.9588714286, 0.8949, 0.1132428571], [0.9598238095, 0.9218333333, 
  0.0948380952], [0.9661, 0.9514428571, 0.0755333333], 
 [0.9763, 0.9831, 0.0538]]

parula_map = LinearSegmentedColormap.from_list('parula', cm_data)


# In[87]:



def plotHeatMap(img,density,colMap,contact,caseNum,side,selectedCurrent,method,methodName,scale,approach,muscles,showInfo,jobID):
#plotHeatMap(img,density,colMap,contact,caseNum,side,selectedCurrent,method,methodName,scale,approach,muscles,showInfo,jobID)
# img: body image
# density: map
# colMap: colormap. 'jet','gray','hot','parula'
# contact: selected lead channel
# caseNum = case/subject number
# side: side of the body to monitor
# selectedCurrent: SCS current0.1
# method: normalization method #
# methodName: normalization method namemetho
# scale = colormap scale computed during normalization
# approach: feature0.1
# muscles: abbreviations
# showInfo: show muscle names. 'yes', 'no'
#%matplotlib notebook
    #fig, ax = plt.subplots()
    import matplotlib
    get_ipython().run_line_magic('matplotlib', 'qt')
    import matplotlib
    import matplotlib.pyplot as plt 
    from mpl_toolkits.axes_grid1 import make_axes_locatable
    #colormap
    matplotlib.rcParams['figure.dpi']= 300

    if colMap=='jet':
        cmap=matplotlib.cm.get_cmap('jet')
    elif colMap=='gray':
        cmap=matplotlib.cm.get_cmap('gray')
    elif colMap=='hot':
        cmap=matplotlib.cm.get_cmap('hot')
    elif colMap=='parula':
        cmap=parula_map


    #remove na from density
    if method==2:
        density=np.ma.masked_where(density<=0, density) 
    if method==1:
        density=np.ma.masked_where(density==0, density) 
    if method==3:
        density=np.ma.masked_where(density==0, density) 
    if method==4:
        density=np.ma.masked_where(density==0, density) 
    if method==5:
        density=np.ma.masked_where(density==0, density)         
    #density=np.ma.masked_outside(density, scale[0],scale[1])
    #create the figure

    mngr = plt.get_current_fig_manager()
    # to put it into the upper left corner for example:
    mngr.window.setGeometry(680,127,888,851)
    # Show the plot in non-blocking mode
    #fig, axs = plt.subplots(0, 2)
    ax1 = plt.subplot(121)
    #plot human jpg
    im=plt.imshow(img,aspect='auto',alpha=0.5,cmap=cmap)
    #plog ontop the overlay image
    OverlayImage=plt.imshow(density,aspect='auto',alpha=0.6,cmap=cmap)
    #ticks
    labels = [item.get_text() for item in ax1.get_xticklabels()]
    empty_string_labels = ['']*len(labels)
    plt.clim(scale)
    ax1.set_xticklabels(empty_string_labels)
    ax1.set_yticklabels(empty_string_labels)
    xposition = [245,745]

    #add midline lines
    for xc in xposition:
        plt.axvline(x=xc, color='k', linestyle='--',linewidth=0.5) 
    #add labels
    plt.annotate('Anterior',(200,1250),size=4,annotation_clip=False,weight="bold") 
    plt.annotate('Posterior',(700,1250),size=4,annotation_clip=False,weight="bold")
    plt.annotate('R',(100,100),size=4,annotation_clip=False,weight="bold")  
    plt.annotate('L',(350,100),size=4,annotation_clip=False,weight="bold")  
    plt.annotate('L',(600,100),size=4,annotation_clip=False,weight="bold")  
    plt.annotate('R',(850,100),size=4,annotation_clip=False,weight="bold")

    #add labels according to side
    if side=='full':   
        #add muscles marks in *
        plt.annotate('*',(170,445),size=4,annotation_clip=False,weight="bold") 
        plt.annotate('*',(170,490),size=4,annotation_clip=False,weight="bold") 
        plt.annotate('*',(305,445),size=4,annotation_clip=False,weight="bold") 
        plt.annotate('*',(305,490),size=4,annotation_clip=False,weight="bold") 
        plt.annotate('*',(145,735),size=4,annotation_clip=False,weight="bold")  
        plt.annotate('*',(335,735),size=4,annotation_clip=False,weight="bold") 
        plt.annotate('*',(215,760),size=4,annotation_clip=False,weight="bold")  
        plt.annotate('*',(260,760),size=4,annotation_clip=False,weight="bold")
        plt.annotate('*',(175,980),size=4,annotation_clip=False,weight="bold")  
        plt.annotate('*',(305,980),size=4,annotation_clip=False,weight="bold") 
        plt.annotate('*',(210,1190),size=4,annotation_clip=False,weight="bold")  
        plt.annotate('*',(270,1190),size=4,annotation_clip=False,weight="bold")

        plt.annotate('*',(690,640),size=4,annotation_clip=False,weight="bold")  
        plt.annotate('*',(780,640),size=4,annotation_clip=False,weight="bold")
        plt.annotate('*',(655,750),size=4,annotation_clip=False,weight="bold")  
        plt.annotate('*',(815,750),size=4,annotation_clip=False,weight="bold")
        plt.annotate('*',(670,975),size=4,annotation_clip=False,weight="bold")  
        plt.annotate('*',(800,975),size=4,annotation_clip=False,weight="bold")

        #add muscles names
        plt.annotate('RUAB',(25,445),size=4,annotation_clip=False) 
        plt.annotate('LUAB',(400,445),size=4,annotation_clip=False) 

        plt.annotate('RLAB',(25,490),size=4,annotation_clip=False) 
        plt.annotate('LLAB',(410,490),size=4,annotation_clip=False) 

        plt.annotate('RQUAD',(1,760),size=4,annotation_clip=False)  
        plt.annotate('LQUAD',(400,760),size=4,annotation_clip=False) 

        plt.annotate('RADD',(115,800),size=4,annotation_clip=False)  
        plt.annotate('LADD',(280,800),size=4,annotation_clip=False)

        plt.annotate('RTA',(65,980),size=4,annotation_clip=False)  
        plt.annotate('LTA',(365,980),size=4,annotation_clip=False) 

        plt.annotate('RAH',(80,1190),size=4,annotation_clip=False)  
        plt.annotate('LAH',(345,1190),size=4,annotation_clip=False)

        plt.annotate('LGLUT',(590,540),size=4,annotation_clip=False)  
        plt.annotate('RGLUT',(770,540),size=4,annotation_clip=False)

        plt.annotate('LBF',(550,810),size=4,annotation_clip=False)  
        plt.annotate('RBF',(880,810),size=4,annotation_clip=False)

        plt.annotate('LMG',(560,975),size=4,annotation_clip=False)  
        plt.annotate('RMG',(850,975),size=4,annotation_clip=False)

    elif side=='right':
        #add muscles marks in *
        plt.annotate('*',(170,445),size=4,annotation_clip=False,weight="bold") 
        plt.annotate('*',(170,490),size=4,annotation_clip=False,weight="bold") 
        plt.annotate('*',(145,735),size=4,annotation_clip=False,weight="bold")  
        plt.annotate('*',(215,760),size=4,annotation_clip=False,weight="bold")  
        plt.annotate('*',(175,980),size=4,annotation_clip=False,weight="bold")  
        plt.annotate('*',(210,1190),size=4,annotation_clip=False,weight="bold")  

        plt.annotate('*',(780,640),size=4,annotation_clip=False,weight="bold")
        plt.annotate('*',(815,750),size=4,annotation_clip=False,weight="bold")
        plt.annotate('*',(800,975),size=4,annotation_clip=False,weight="bold")

        #add muscles names
        plt.annotate('RUAB',(25,445),size=4,annotation_clip=False) 
        plt.annotate('RLAB',(25,490),size=4,annotation_clip=False) 
        plt.annotate('RQUAD',(1,760),size=4,annotation_clip=False)  
        plt.annotate('RADD',(115,800),size=4,annotation_clip=False)  
        plt.annotate('RTA',(65,980),size=4,annotation_clip=False)  
        plt.annotate('RAH',(80,1190),size=4,annotation_clip=False)  
        plt.annotate('RGLUT',(770,540),size=4,annotation_clip=False)
        plt.annotate('RBF',(880,810),size=4,annotation_clip=False)
        plt.annotate('RMG',(850,975),size=4,annotation_clip=False)

    elif side=='left':
        #add muscles marks in *
        plt.annotate('*',(305,445),size=4,annotation_clip=False,weight="bold") 
        plt.annotate('*',(305,490),size=4,annotation_clip=False,weight="bold") 
        plt.annotate('*',(335,735),size=4,annotation_clip=False,weight="bold") 
        plt.annotate('*',(260,760),size=4,annotation_clip=False,weight="bold")
        plt.annotate('*',(305,980),size=4,annotation_clip=False,weight="bold") 
        plt.annotate('*',(270,1190),size=4,annotation_clip=False,weight="bold")

        plt.annotate('*',(690,640),size=4,annotation_clip=False,weight="bold")  
        plt.annotate('*',(655,750),size=4,annotation_clip=False,weight="bold")  
        plt.annotate('*',(670,975),size=4,annotation_clip=False,weight="bold")  

        #add muscles names
        plt.annotate('LUAB',(400,445),size=4,annotation_clip=False) 
        plt.annotate('LLAB',(410,490),size=4,annotation_clip=False) 
        plt.annotate('LQUAD',(400,760),size=4,annotation_clip=False) 
        plt.annotate('LADD',(280,800),size=4,annotation_clip=False)
        plt.annotate('LTA',(365,980),size=4,annotation_clip=False) 
        plt.annotate('LAH',(345,1190),size=4,annotation_clip=False)
        plt.annotate('LGLUT',(590,540),size=4,annotation_clip=False)  
        plt.annotate('LBF',(550,810),size=4,annotation_clip=False)  
        plt.annotate('LMG',(560,975),size=4,annotation_clip=False)  

    #create 2nd plot for parameters 

    ax2 = plt.subplot(122)
    #create colorbar
    cbar=matplotlib.pyplot.colorbar(cmap=cmap,  orientation="horizontal", ax=ax1,shrink=1,pad=0.1)
    if scale[1]>20:
        loc=np.arange(0, scale[1] // 10 *10,10)
        loc=np.insert(loc,np.floor(scale[0]),loc[0]-10)
        loc=np.append(loc,loc[len(loc)-1]+10)
    elif scale[1]>10:
        loc=np.arange(np.floor(scale[0]),scale[1],2)
    elif scale[1]>2: 
        loc=np.arange(np.floor(scale[0]),scale[1]+1,0.5)
    else: 
        loc=np.arange(np.floor(scale[0])-0.1,scale[1]+0.1,0.2)

    cbar.set_ticks(loc)
    cbar.ax.tick_params(labelsize=4) 
    #ticks
    ax2.set_xticklabels(empty_string_labels)
    ax2.set_yticklabels(empty_string_labels)
    #make tight fit of both plots
    plt.tight_layout(pad=0.4, w_pad=0.5, h_pad=1.0)

    #add label to colorbar
    if method==1:
        cbt = 'dB';
    elif method==2:
        cbt = '%'
    elif method==3:
        cbt = 'uV'
    elif method==4:
        cbt = 'dB'
    elif method==5:
        cbt = 'uV'

    cbar.set_label(cbt, labelpad=0, y=1.05, rotation=0,size=10)

    #add parameters to 2nd plot
    plt.annotate('Selected Parameters:',(0.01,0.97),size=4)
    plt.annotate('Case #:' + str(caseNum),(0.01,0.94),size=4)
    plt.annotate('Contact: P' + str(contact),(0.01,0.91),size=4)
    plt.annotate('Stimulation at ' + str(selectedCurrent),(0.01,0.88),size=4)
    plt.annotate('Other SCS parameters: 60Hz/300us',(0.01,0.85),size=4)
    plt.annotate('Normalization: '+str(methodName),(0.01,0.82),size=4)
    plt.annotate('Body: '+str(side),(0.01,0.79),size=4)
    plt.annotate('Feature: '+str(approach),(0.01,0.76),size=4)
    plt.annotate('Color map: '+str(colMap),(0.01,0.73),size=4)
    plt.annotate('Original Job ID: '+ str(jobID),(0.01,0.70),size=4)


    plt.annotate('Muscles: ',(0.01,0.65),size=4)
    plt.annotate('LADD:Left Adductor magnus ',(0.01,0.62),size=4)
    plt.annotate('LAH:Left Adductor hallucis',(0.01,0.59),size=4)
    plt.annotate('LBF:Left Bicep femoris',(0.01,0.56),size=4)
    plt.annotate('LGLUT:Left Gluteus maximus ',(0.01,0.53),size=4)
    plt.annotate('LLAB:Left Lower abs ',(0.01,0.50),size=4)
    plt.annotate('LMG:Left Medial gastroc',(0.01,0.47),size=4)
    plt.annotate('LQUAD:Left Vastus group(Quads) ',(0.01,0.44),size=4)
    plt.annotate('LTA:Left Tibialis anterior',(0.01,0.41),size=4)
    plt.annotate('LUAB:Left Upper abs',(0.01,0.38),size=4)
    plt.annotate('RADD:Right Adductor magnus ',(0.01,0.35),size=4)
    plt.annotate('RAH:Right Adductor hallucis ',(0.01,0.32),size=4)
    plt.annotate('RBF:Right Bicep femoris',(0.01,0.29),size=4)
    plt.annotate('RGLUT:Right Gluteus maximus',(0.01,0.26),size=4)
    plt.annotate('RLAB:Right Lower abs',(0.01,0.23),size=4)
    plt.annotate('RMG:Right Medial gastroc ',(0.01,0.20),size=4)
    plt.annotate('RQUAD:Right Vastus group(Quads) ',(0.01,0.17),size=4)
    plt.annotate('RTA:Right Tibialimas anterior',(0.01,0.14),size=4)
    plt.annotate('RUAB:Right Upper abs',(0.01,0.11),size=4)

    plt.savefig("test.svg")



# In[88]:


# Heat map generation Script
# omethod: 'max', 'rms', 'peak'
import numpy as np
import scipy
# matDir = 'c:\ilknurmatlab'
matDir = '/Users/adityabehal/Downloads/'

caseNumber =4
contactNum = 1 
out_method = 'rms' 
selectedCurrent = 3.4 
normalizationMethod = 4  
bodySide = 'full' 
selectedColorMap = 'hot'



 

featureTable,fs,stims,contact,caseNum,approach=generateFeatureMatx(matDir,out_method,contactNum,caseNumber);

# convert table to data
feature=featureTable
feature=feature.drop(['current'], axis=1)
muscles={'LADD','LAH','LBF','LGLUT','LLAB','LMG','LQUAD','LTA','LUAB','RADD','RAH','RBF','RGLUT','RLAB','RMG','RQUAD','RTA','RUAB'};

# normalization
#[ndata] = normalizeEMG(data,selectedCurrent,stims,method)
# method: 1:baseline in dB, 2:baseline %, 3: min-max, 4:group avg, 5: raw
ndata,method,methodName,scale = normalizeEMG(feature,selectedCurrent,stims,normalizationMethod);

## generate overlap image
#pwd = 'c:\ilknurmatlab'
density,img = generateOverlay(ndata,bodySide,matDir);
## plot
plotHeatMap(img,density,selectedColorMap,contact,caseNum,bodySide,selectedCurrent,method,methodName,scale,approach,muscles,'yes','-');


# In[89]:


scale


# In[ ]:





# In[ ]:




