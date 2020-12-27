const fs   = require('fs').promises;
const path = require('path');

generate_code = async (options, dimensions, tl_params, file_path) => {
    //creating the string to write (stw)
    let stw = "##################################################\n";
    stw     += "####### This Code is produced by Deep GUI ########\n";
    stw     += "##################################################\n\n";
    stw     += "#import statements\n";;
    if(options.framework === "TensorFlow"){
        stw += "import tensorflow as tf\n";
        stw += "import tensorflow.keras as keras\n\n\n";
        stw += "#specify x_train and y_train here:\n";
        stw += "x_train = \n";
        stw += "y_train = \n\n\n";
        stw += "#creating the model\n";

        //checking for the transfer learning
        if(options.tl_enable){
            stw += `base_model = keras.applications.${tl_params.model}(input_shape = (${tl_params.shape[0]}, ${tl_params.shape[1]}, ${tl_params.shape[2]}), include_top = False, weights = ${tl_params.pretrained?"'imagenet'":"None"})\n`;
            stw += `base_model.trainable = ${tl_params.trainable?"True":"False"}\n\n`
        }

        stw += "model = keras.Sequntial()\n\n";
        stw += "#adding layers\n";

        if (options.tl_enable){
            stw += "model.add(base_model)\n"
        }

        let input_shape = "(";
        for(let i = 0; i < dimensions.length; i++){
            input_shape += `${dimensions[i]},`;
        }
        if(dimensions.length !== 1){
            input_shape = input_shape.slice(0,-1);
        }

        input_shape += ")";
        if (options.layers[0].name !== "Embedding" && !options.tl_enable){
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
        let transfer_first = true;
        let models         = {
            "Alexnet"                        : "alexnet",
            "VGG 11"                         : "vgg11",
            "VGG 13"                         : "vgg13",
            "VGG 16"                         : "vgg16",
            "VGG 19"                         : "vgg19",
            "VGG 11 with Batch Normalization": "vgg11_bn",
            "VGG 13 with Batch Normalization": "vgg13_bn",
            "VGG 16 with Batch Normalization": "vgg16_bn",
            "VGG 19 with Batch Normalization": "vgg19_bn",
            "ResNet 18"                      : "resnet18",
            "ResNet 34"                      : "resnet34",
            "ResNet 50"                      : "resnet50",
            "ResNet 101"                     : "resnet101",
            "ResNet 152"                     : "resnet152",
            "SqueezeNet 1.0"                 : "squeezenet1_0",
            "SqueezeNet 1.1"                 : "squeezenet1_1",
            "DenseNet 121"                   : "densenet121",
            "DenseNet 169"                   : "densenet169",
            "DenseNet 161"                   : "densenet161",
            "DenseNet 201"                   : "densenet201",
            "Inception V3"                   : "inception_v3",
            "GoogLeNet"                      : "googlenet",
            "ShuffleNet V2 0.5x"             : "shufflenet_v2_x0_5",
            "ShuffleNet V2 1.0x"             : "shufflenet_v2_x1_0",
            "ShuffleNet V2 1.5x"             : "shufflenet_v2_x1_5",
            "ShuffleNet V2 2.0x"             : "shufflenet_v2_x2_0",
            "MobileNet V2"                   : "mobilenet_v2",
            "ResNeXt-50 32x4d"               : "resnext50_32x4d",
            "ResNeXt-101 32x8d"              : "resnext101_32x8d",
            "Wide ResNet-50-2"               : "wide_resnet50_2",
            "Wide ResNet-101-2"              : "wide_resnet101_2",
            "MNASNet 0.5"                    : "mnasnet0_5",
            "MNASNet 0.75"                   : "mnasnet0_75",
            "MNASNet 1.0"                    : "mnasnet1_0",
            "MNASNet 1.3"                    : "mnasnet1_3",
        }

        stw += "import torch\n";
        stw += "import torch.nn as nn\n";
        if (options.tl_enable){
            stw += "from torchvision import models\n";
        }
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
        stw += `data_loader = DataLoader(custom_dataset, batch_size = ${options.batch}, shuffle = True)\n\n\n`;
        stw += "#creating the model\n";
        if (options.tl_enable) {
            stw += `model = models.${models[tl_params.model]}(pretrained = ${tl_params.pretrained?"True":"False"})\n`;
            if (!tl_params.trainable){
                stw += "for param in model.parameters():\n";
                stw += "\tparam.requires_grad = False\n\n";
            }
            stw += "features_num = model.fc.in_features\n";
            stw += "head = ";
        }
        else {
            stw += "model = ";
        }
        stw += "nn.Sequntial(\n";

        for(layer of options.layers){
            let ret_seq = "False";
            switch(layer.name){
                //linear case
                case "Linear":
                    if (options.tl_enable && transfer_first){
                        transfer_first = false;
                        stw += `\tnn.Linear(in_features = features_num, out_features = ${layer.unit_num}),\n`;
                    }
                    else {
                        stw += `\tnn.Linear(in_features = ${dimensions[dimensions.length - 1]}, out_features = ${layer.unit_num}),\n`;
                    }
                    dimensions[dimensions.length - 1] = layer.unit_num;
                    if (layer.activation !== "Linear"){
                        stw += `\tnn.${layer.activation}(),\n`;
                    }
                    break;

                //convolution 1D case
                case "Convolution 1D":
                    stw += `\tnn.Conv1d(in_channels = ${dimensions[0]}, out_channels = ${layer.filter_num}, kernel_size = ${layer.filter_size}, stride = ${layer.stride}, padding = ${layer.padding}),\n`;
                    if (layer.activation !== "Linear"){
                        stw += `\tnn.${layer.activation}(),\n`;
                    }
                    dimensions[0] = layer.filter_num;
                    dimensions[1] = Math.floor((dimensions[1] + 2 * layer.padding - (layer.filter_size - 1) - 1) / layer.stride + 1);
                    break;

                //convolution 2D case
                case "Convolution 2D":
                    stw += `\tnn.Conv2d(in_channels = ${dimensions[0]}, out_channels = ${layer.filter_num}, kernel_size = (${layer.filter_size[0]}, ${layer.filter_size[1]}), stride = ${layer.stride}, padding = ${layer.padding}),\n`;
                    if (layer.activation !== "Linear"){
                        stw += `\tnn.${layer.activation}(),\n`;
                    }
                    dimensions[0] = layer.filter_num;
                    dimensions[1] = Math.floor((dimensions[1] + 2 * layer.padding - (layer.filter_size[0] - 1) - 1) / layer.stride + 1);
                    dimensions[2] = Math.floor((dimensions[2] + 2 * layer.padding - (layer.filter_size[1] - 1) - 1) / layer.stride + 1);
                    break;

                //convolution 3D case
                case "Convolution 3D":
                    stw += `\tnn.Conv3d(in_channels = ${dimensions[0]}, out_channels = ${layer.filter_num}, kernel_size = (${layer.filter_size[0]}, ${layer.filter_size[1]}, ${layer.filter_size[2]}), stride = ${layer.stride}, padding = ${layer.padding}),\n`;
                    if (layer.activation !== "Linear"){
                        stw += `\tnn.${layer.activation}(),\n`;
                    }
                    dimensions[0] = layer.filter_num;
                    dimensions[1] = Math.floor((dimensions[1] + 2 * layer.padding - (layer.filter_size[0] - 1) - 1) / layer.stride + 1);
                    dimensions[2] = Math.floor((dimensions[2] + 2 * layer.padding - (layer.filter_size[1] - 1) - 1) / layer.stride + 1);
                    dimensions[3] = Math.floor((dimensions[3] + 2 * layer.padding - (layer.filter_size[2] - 1) - 1) / layer.stride + 1);
                    break;

                //max pool 1D case
                case "Max Pool 1D":
                    stw += `\tnn.MaxPool1d(kernel_size = (${layer.filter_size}), stride = ${layer.stride}),\n`;
                    dimensions[1] = Math.floor((dimensions[1] - (layer.filter_size - 1) - 1) / layer.stride + 1);
                    break;

                //max pool 2D case
                case "Max Pool 2D":
                    stw += `\tnn.MaxPool2d(kernel_size = (${layer.filter_size[0]}, ${layer.filter_size[1]}), stride = ${layer.stride}),\n`;
                    dimensions[1] = Math.floor((dimensions[1] - (layer.filter_size[0] - 1) - 1) / layer.stride + 1);
                    dimensions[2] = Math.floor((dimensions[2] - (layer.filter_size[1] - 1) - 1) / layer.stride + 1);
                    break;

                //max pool 3D case
                case "Max Pool 3D":
                    stw += `\tnn.MaxPool3d(kernel_size = (${layer.filter_size[0]}, ${layer.filter_size[1]}, ${layer.filter_size[2]}), stride = ${layer.stride}),\n`;
                    dimensions[1] = Math.floor((dimensions[1] - (layer.filter_size[0] - 1) - 1) / layer.stride + 1);
                    dimensions[2] = Math.floor((dimensions[2] - (layer.filter_size[1] - 1) - 1) / layer.stride + 1);
                    dimensions[3] = Math.floor((dimensions[3] - (layer.filter_size[2] - 1) - 1) / layer.stride + 1);
                    break;

                //max pool 3D case
                case "Activation":
                    stw += `\tnn.${layer.type}(),\n`;
                    break;

                //avg pool 1D case
                case "Avg Pool 1D":
                    stw += `\tnn.AvgPool1d(kernel_size = (${layer.filter_size}), stride = ${layer.stride}),\n`;
                    dimensions[1] = Math.floor((dimensions[1] - (layer.filter_size - 1) - 1) / layer.stride + 1);
                    break;

                //avg pool 2D case
                case "Avg Pool 2D":
                    stw += `\tnn.AvgPool2d(kernel_size = (${layer.filter_size[0]}, ${layer.filter_size[1]}), stride = ${layer.stride}),\n`;
                    dimensions[1] = Math.floor((dimensions[1] - (layer.filter_size[0] - 1) - 1) / layer.stride + 1);
                    dimensions[2] = Math.floor((dimensions[2] - (layer.filter_size[1] - 1) - 1) / layer.stride + 1);
                    break;

                //avg pool 3D case
                case "Avg Pool 3D":
                    stw += `\tnn.AvgPool3d(kernel_size = (${layer.filter_size[0]}, ${layer.filter_size[1]}, ${layer.filter_size[2]}), stride = ${layer.stride}),\n`;
                    dimensions[1] = Math.floor((dimensions[1] - (layer.filter_size[0] - 1) - 1) / layer.stride + 1);
                    dimensions[2] = Math.floor((dimensions[2] - (layer.filter_size[1] - 1) - 1) / layer.stride + 1);
                    dimensions[3] = Math.floor((dimensions[3] - (layer.filter_size[2] - 1) - 1) / layer.stride + 1);
                    break;

                //batch normalization cases
                case "Batch Norm 1D":
                    stw += `\tnn.BatchNorm1d(num_features = ${layer.param_num}),\n`;
                    break;

                case "Batch Norm 2D":
                    stw += `\tnn.BatchNorm2d(num_features = ${layer.param_num}),\n`;
                    break;

                case "Batch Norm 3D":
                    stw += `\tnn.BatchNorm3d(num_features = ${layer.param_num}),\n`;
                    break;

                //dropout case
                case "Dropout":
                    stw += `\tnn.Dropout(p = ${layer.prob}),\n`;
                    break;
                
                //embedding case
                case "Embedding":
                    stw += `\tnn.Embedding(num_embeddings = ${layer.input_dim}, embedding_dim = ${layer.output_dim}),\n`;
                    dimensions.push(layer.output_dim);
                    break;

                //flatten case
                case "Flatten":
                    stw += `\tnn.Flatten(),\n`;
                    let final = dimensions.reduce(Math.imul);
                    dimensions = [final];
                    break;
            }
        }
        stw = stw.slice(0,-2);
        stw += "\n)\n";
        
        if (options.tl_enable){
            stw += "model.fc = head\n\n"; 
        }
        else {
            stw += "\n";
        }

        stw += "#loss function definition\n";
        stw += `loss_fn = nn.${options.loss}()\n\n`;
        stw += "#optomizer definition\n";
        stw += `optimizer = torch.optim.${options.optimizer}(model.parameters(), lr = ${options.lr})\n\n`;
        stw += "#training loop\n";
        stw += "model.train()\n";
        stw += `for epoch in range(${options.epoch}):\n`;
        stw += `\tfor x_train, labels in data_loader:\n`;
        stw += "\t\ty_hat = model(x_train)\n";
        stw += "\t\tloss = loss_fn(y_hat, labels)\n";
        stw += "\t\tloss.backward()\n";
        stw += "\t\toptimizer.step()\n"
        stw += "\t\toptimizer.zero_grad()\n"
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