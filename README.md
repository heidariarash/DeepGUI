# DeepGUI
## What is DeepGUI
DeepGUI is a graphical user interface which generates Deep Learning Frameworks codes for you. You can just add, remove, and edit layers in a graphical way and the interface generates python code for you. Cool, ha?

DeepGUI is built using Electron.js framework.

## What you can expect in the newer version
The new features are as follows:
+ Now you can use transfer learning.

+ The bug in the learning rate is fixed.

## DeepGUI Version 0.2.0 is OUT!
What's New!? Now you can ...
+ Generate code using PyTorch framework (although, because PyTorch sequential models doesn't support time analysis, recurrent layers are not supported).

+ Add new layers between other layers. Previously it was only possible to add layers at the end of the sequence.

+ Save the diagram into a .dgui file and load it back later.

## DeepGUI Version 0.1.0 is OUT!
The specifications of this version:
+ These layers are available in this version:
    - Dense,
    - Convolution (1D, 2D, and 3D) layers,
    - Pooling (Max and Average) (1D, 2D, and 3D)
    - RNN, LSTM, and GRU layers,
    - Embedding layer,
    - Batch Normalization layer,
    - Flatten layer,
    - Dropout layer,
    - and Activation layer.

+ Only TensorFlow framework is accessible. PyTorch will be added soon.
+ Basic configurations of each layer is added. Advanced configurations will be added soon.
+ Only Sequential  models are available in this version.

## Some Screenshots of the GUI
I provide some screenshots of the GUI here. I know that this configuration is not OK for a 10-class image dataset classification. It's just a simple example.
### Main Window
<p align="center">
  <img width="1096" height="996" src="./gallery/Main-Window.PNG">
</p>

### Convolutions Configurations
<p align="center">
  <img width="402" height="371" src="./gallery/Convolution-Config.PNG">
</p>

### Successful Generation of Code
<p align="center">
  <img width="407" height="349" src="./gallery/Code-Successful.PNG">
</p>

### Generated Code
<p align="center">
  <img width="1338" height="602" src="./gallery/Generated-Code.PNG">
</p>
