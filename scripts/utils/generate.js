const fs = require('fs').promises;
const path = require('path');

generate_code = async (options, dimensions, file_path) => {
    //creating the string to write (stw)
    let stw = "##################################################\n";
    stw += "####### This Code is produced by Deep GUI ########\n";
    stw += "##################################################\n\n";
    stw += "#import statements\n";;
    let success = 1;
    if(options.framework === "TensorFlow"){
        stw += "import tensorflow as tf\n";
        stw += "import tensorflow.keras as keras\n\n\n";
        stw += "#specify x_train and y_train here:\n";
        stw += "x_train = \n";
        stw += "y_train = \n\n\n"
        stw += "#creating the model\n"
        stw += "model = keras.Sequntial()\n\n"
        stw += "#adding layers\n"
        let input_shape = "(";
        for(let i = 0; i < dimensions.length; i++){
            input_shape += `${dimensions[i]},`;
        }
        input_shape = input_shape.slice(0,-1);
        input_shape += ")";
        if (options.layers[0].name !== "Embedding"){
            stw += `model.add(keras.layers.InputLayer(input_shape = ${input_shape}))\n`;
        }

        for(layer of options.layers){
            let ret_seq = "False";
            switch(layer.name){
                //linear case
                case "Linear":
                    stw += `model.add(keras.layers.Dense(${layer.unit_num}, activation = '${layer.activation.toLowerCase()}'))`
                    break;

                //convolution 1D case
                case "Convolution 1D":
                    stw += `model.add(keras.layers.Conv1D(${layer.filter_num}, ${layer.filter_size}, strides = ${layer.stride}, activation = '${layer.activation.toLowerCase()}', padding = '${layer.padding}'))`
                    break;

                //convolution 2D case
                case "Convolution 2D":
                    stw += `model.add(keras.layers.Conv2D(${layer.filter_num}, (${layer.filter_size[0]}, ${layer.filter_size[1]}), strides = ${layer.stride}, activation = '${layer.activation.toLowerCase()}', padding = '${layer.padding}'))`
                    break;

                //convolution 3D case
                case "Convolution 3D":
                    stw += `model.add(keras.layers.Conv3D(${layer.filter_num}, (${layer.filter_size[0]}, ${layer.filter_size[1]}, ${layer.filter_size[2]}), strides = ${layer.stride}, activation = '${layer.activation.toLowerCase()}', padding = '${layer.padding}'))`
                    break;

                //max pool 1D case
                case "Max Pool 1D":
                    stw += `model.add(keras.layers.MaxPooling1D(${layer.filter_size}, strides = ${layer.stride}))`
                    break;

                //max pool 2D case
                case "Max Pool 2D":
                    stw += `model.add(keras.layers.MaxPooling2D((${layer.filter_size[0]}, ${layer.filter_size[1]}), strides = ${layer.stride}))`
                    break;

                //max pool 3D case
                case "Max Pool 3D":
                    stw += `model.add(keras.layers.MaxPooling3D((${layer.filter_size[0]}, ${layer.filter_size[1]}, ${layer.filter_size[2]}), strides = ${layer.stride}))`
                    break;

                //max pool 3D case
                case "Activation":
                    if (['ELU', 'LeakyReLU', 'PReLU', 'ReLU', 'Softmax', 'ThresholdedReLU'].indexOf(layer.type) >= 0){
                        stw += `model.add(keras.layers.${layer.type}())`;
                    }
                    else{
                        stw += `model.add(keras.layers.Activation(activations.${layer.type}))`
                    }
                    break;

                //avg pool 1D case
                case "Avg Pool 1D":
                    stw += `model.add(keras.layers.AveragePooling1D(${layer.filter_size}, strides = ${layer.stride}))`;
                    break;

                //avg pool 2D case
                case "Avg Pool 2D":
                    stw += `model.add(keras.layers.AveragePooling2D((${layer.filter_size[0]}, ${layer.filter_size[1]}), strides = ${layer.stride}))`;
                    break;

                //avg pool 3D case
                case "Avg Pool 3D":
                    stw += `model.add(keras.layers.AveragePooling3D((${layer.filter_size[0]}, ${layer.filter_size[1]}, ${layer.filter_size[2]}), strides = ${layer.stride}))`;
                    break;

                //batch normalization case
                case "Batch Normalization":
                    stw += `model.add(keras.layers.BatchNormalization())`;
                    break;

                //dropout case
                case "Dropout":
                    stw += `model.add(keras.layers.Dropout(rate = ${layer.prob}))`;
                    break;
                
                //embedding case
                case "Embedding":
                    stw += `model.add(keras.layers.Embedding(input_dim = ${layer.input_dim}, output_dim = ${layer.output_dim}, input_length = ${layer.input_length}))`;
                    break;

                //flatten case
                case "Flatten":
                    stw += `model.add(keras.layers.Flatten())`;
                    break;

                //LSTM and GRU case
                case "GRU":
                case "LSTM":
                    if(layer.ret_seq) {
                        ret_seq = "True";
                    }
                    stw += `model.add(keras.layers.${layer.name}(units = ${layer.units}, activations = '${layer.activation}', recurrent_activation = '${layer.re_activation}', return_sequences = ${ret_seq}))`;
                    break;

                //RNN case
                case "RNN":
                    if(layer.ret_seq) {
                        ret_seq = "True";
                    }
                    stw += `model.add(keras.layers.SimpleRNN(units = ${layer.units}, activations = '${layer.activation}', return_sequences = ${ret_seq}))`;
                    break;
            }
            stw += "\n"
        }

        stw += "\n";
        stw += "#compiling the model\n";
        stw += `model.compile(optimizer = keras.optimizers.${options.optimizer}(learning_rate = ${options.lr}), loss = '${options.loss}')\n\n`;
        stw += "#training the model\n";
        stw += `model.fit(x= x_train, y= y_train, batch_size = ${options.batch}, epochs = ${options.epoch})`;
        try {
            await fs.writeFile(file_path, stw);
            return true;
        }
        catch(err){
            return false;
        }
    }
    else if(options.framework == "PyTorch"){
        stw += "import torch\n";
        stw += "import torch.nn as nn\n";
        stw += "from torch.utils.data import Dataset, DataLoader\n\n\n";
        stw += "#specify your dataset here:\n";
        stw += "class CustomDataset(Dataset):\n";
        stw += "\tdef __init__(self):\n";
        stw += "\t\t#define init function here\n";
        stw += "\t\tsuper().__init__()\n";
        stw += "\t\tpass\n\n\n";
        stw += "\tdef __len__(self):\n";
        stw += "\t\t#define len function here\n";
        stw += "\t\tpass\n\n\n";
        stw += "\tdef __getitem__(self, idx):\n";
        stw += "\t\t#define getitem function here\n";
        stw += "\t\tpass\n\n\n";
        stw += "#Instantiating the dataset\n";
        stw += "custom_dataset = CustomDataset()\n\n\n";
        stw += "#Define DataLoader here\n";
        stw += `data = DataLoader(custom_dataset, batch_size = ${options.batch}, shuffle = True)\n\n\n`;
        stw += "#creating the model\n";
        stw += "model = nn.Sequntial(\n";

        for(layer of options.layers){
            let ret_seq = "False";
            switch(layer.name){
                //linear case
                case "Linear":
                    stw += `\tnn.Linear(in_features = ${dimensions[dimensions.length - 1]}, out_features = ${layer.unit_num})\n`;
                    dimensions[dimensions.length - 1] = layer.unit_num;
                    if (layer.activation !== "Linear"){
                        stw += `\tnn.${layer.activation}()\n`;
                    }
                    break;

                //convolution 1D case
                case "Convolution 1D":
                    stw += `\tnn.Conv1D(in_channels = ${dimensions[0]}, out_channels = ${layer.filter_num}, kernel_size = ${layer.filter_size}, stride = ${layer.stride}, padding = ${layer.padding})\n`;
                    if (layer.activation !== "Linear"){
                        stw += `\tnn.${layer.activation}()\n`;
                    }
                    dimensions[0] = layer.filter_num;
                    dimensions[1] = Math.floor((dimensions[1] + 2 * layer.padding - (layer.filter_size - 1) - 1) / layer.stride + 1);
                    break;

                //convolution 2D case
                case "Convolution 2D":
                    stw += `\tnn.Conv2D(in_channels = ${dimensions[0]}, out_channels = ${layer.filter_num}, kernel_size = (${layer.filter_size[0]}, ${layer.filter_size[1]}), stride = ${layer.stride}, padding = ${layer.padding})\n`;
                    if (layer.activation !== "Linear"){
                        stw += `\tnn.${layer.activation}()\n`;
                    }
                    dimensions[0] = layer.filter_num;
                    dimensions[1] = Math.floor((dimensions[1] + 2 * layer.padding - (layer.filter_size[0] - 1) - 1) / layer.stride + 1);
                    dimensions[2] = Math.floor((dimensions[2] + 2 * layer.padding - (layer.filter_size[1] - 1) - 1) / layer.stride + 1);
                    break;

                //convolution 3D case
                case "Convolution 3D":
                    stw += `\tnn.Conv3D(in_channels = ${dimensions[0]}, out_channels = ${layer.filter_num}, kernel_size = (${layer.filter_size[0]}, ${layer.filter_size[1]}, ${layer.filter_size[2]}), stride = ${layer.stride}, padding = ${layer.padding})\n`;
                    if (layer.activation !== "Linear"){
                        stw += `\tnn.${layer.activation}()\n`;
                    }
                    dimensions[0] = layer.filter_num;
                    dimensions[1] = Math.floor((dimensions[1] + 2 * layer.padding - (layer.filter_size[0] - 1) - 1) / layer.stride + 1);
                    dimensions[2] = Math.floor((dimensions[2] + 2 * layer.padding - (layer.filter_size[1] - 1) - 1) / layer.stride + 1);
                    dimensions[3] = Math.floor((dimensions[3] + 2 * layer.padding - (layer.filter_size[2] - 1) - 1) / layer.stride + 1);
                    break;

                //max pool 1D case
                case "Max Pool 1D":
                    stw += `model.add(keras.layers.MaxPooling1D(${layer.filter_size}, strides = ${layer.stride}))`
                    break;

                //max pool 2D case
                case "Max Pool 2D":
                    stw += `model.add(keras.layers.MaxPooling2D((${layer.filter_size[0]}, ${layer.filter_size[1]}), strides = ${layer.stride}))`
                    break;

                //max pool 3D case
                case "Max Pool 3D":
                    stw += `model.add(keras.layers.MaxPooling3D((${layer.filter_size[0]}, ${layer.filter_size[1]}, ${layer.filter_size[2]}), strides = ${layer.stride}))`
                    break;

                //max pool 3D case
                case "Activation":
                    stw += `\tnn.${layer.type}()`;
                    break;

                //avg pool 1D case
                case "Avg Pool 1D":
                    stw += `model.add(keras.layers.AveragePooling1D(${layer.filter_size}, strides = ${layer.stride}))`;
                    break;

                //avg pool 2D case
                case "Avg Pool 2D":
                    stw += `model.add(keras.layers.AveragePooling2D((${layer.filter_size[0]}, ${layer.filter_size[1]}), strides = ${layer.stride}))`;
                    break;

                //avg pool 3D case
                case "Avg Pool 3D":
                    stw += `model.add(keras.layers.AveragePooling3D((${layer.filter_size[0]}, ${layer.filter_size[1]}, ${layer.filter_size[2]}), strides = ${layer.stride}))`;
                    break;

                //batch normalization case
                case "Batch Normalization":
                    stw += `model.add(keras.layers.BatchNormalization())`;
                    break;

                //dropout case
                case "Dropout":
                    stw += `\tnn.Dropout(p = ${layer.prob})`;
                    break;
                
                //embedding case
                case "Embedding":
                    stw += `model.add(keras.layers.Embedding(input_dim = ${layer.input_dim}, output_dim = ${layer.output_dim}, input_length = ${layer.input_length}))`;
                    break;

                //flatten case
                case "Flatten":
                    stw += `model.add(keras.layers.Flatten())`;
                    break;

                //LSTM and GRU case
                case "GRU":
                case "LSTM":
                    if(layer.ret_seq) {
                        ret_seq = "True";
                    }
                    stw += `model.add(keras.layers.${layer.name}(units = ${layer.units}, activations = '${layer.activation}', recurrent_activation = '${layer.re_activation}', return_sequences = ${ret_seq}))`;
                    break;

                //RNN case
                case "RNN":
                    if(layer.ret_seq) {
                        ret_seq = "True";
                    }
                    stw += `model.add(keras.layers.SimpleRNN(units = ${layer.units}, activations = '${layer.activation}', return_sequences = ${ret_seq}))`;
                    break;
            }
        }

        stw += "\n";
        stw += "#compiling the model\n";
        stw += `model.compile(optimizer = keras.optimizers.${options.optimizer}(learning_rate = ${options.lr}), loss = '${options.loss}')\n\n`;
        stw += "#training the model\n";
        stw += `model.fit(x= x_train, y= y_train, batch_size = ${options.batch}, epochs = ${options.epoch})`;
        try {
            await fs.writeFile(file_path, stw);
            return true;
        }
        catch(err){
            return false;
        }
    }
}

module.exports = generate_code;