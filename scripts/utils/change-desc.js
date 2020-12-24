const change_desc = (layer, framework) => {
    let filter_size = "";
    configed_layer  = document.getElementById(layer.id);
            switch(layer.name){
                case "Convolution 1D":
                    configed_layer.getElementsByTagName("p")[0].innerHTML = `Number of filters: ${layer.filter_num}`;
                    configed_layer.getElementsByTagName("p")[1].innerHTML = `Filter Size: ${layer.filter_size}`;
                    configed_layer.getElementsByTagName("p")[2].innerHTML = `Stride: ${layer.stride}`;
                    configed_layer.getElementsByTagName("p")[3].innerHTML = `Activation: ${layer.activation}`;
                    configed_layer.getElementsByTagName("p")[4].innerHTML = `Padding: ${layer.padding}`;
                    break;
                case "Convolution 2D":
                case "Convolution 3D":
                    for(size of layer.filter_size){
                        filter_size += `${size},`;
                    }
                    filter_size                                           = filter_size.slice(0,-1);
                    configed_layer.getElementsByTagName("p")[1].innerHTML = `Filter Size: ${filter_size}`;
                    configed_layer.getElementsByTagName("p")[0].innerHTML = `Number of filters: ${layer.filter_num}`;
                    configed_layer.getElementsByTagName("p")[2].innerHTML = `Stride: ${layer.stride}`;
                    configed_layer.getElementsByTagName("p")[3].innerHTML = `Activation: ${layer.activation}`;
                    configed_layer.getElementsByTagName("p")[4].innerHTML = `Padding: ${layer.padding}`;
                    break;
                case "Avg Pool 1D":
                case "Max Pool 1D":
                    configed_layer.getElementsByTagName("p")[0].innerHTML = `Filter Size: ${layer.filter_size}`;
                    configed_layer.getElementsByTagName("p")[1].innerHTML = `Stride: ${layer.stride}`;
                    break;
                case "Avg Pool 2D":
                case "Avg Pool 3D":
                case "Max Pool 2D":
                case "Max Pool 3D":
                    for(size of layer.filter_size){
                        filter_size += `${size},`;
                    }
                    filter_size                                           = filter_size.slice(0,-1);
                    configed_layer.getElementsByTagName("p")[0].innerHTML = `Filter Size: ${filter_size}`;
                    configed_layer.getElementsByTagName("p")[1].innerHTML = `Stride: ${layer.stride}`;
                    break;
                case "LSTM":
                case "GRU":
                    configed_layer.getElementsByTagName("p")[0].innerHTML = `Number of Units: ${layer.units}`;
                    configed_layer.getElementsByTagName("p")[1].innerHTML = `Activation: ${layer.activation}`;
                    configed_layer.getElementsByTagName("p")[2].innerHTML = `Recurrent Activation: ${layer.re_activation}`;
                    configed_layer.getElementsByTagName("p")[3].innerHTML = `Return Sequence: ${layer.return_sequence?'True':'False'}`;
                    break;
                case "RNN":
                    configed_layer.getElementsByTagName("p")[0].innerHTML = `Number of Units: ${layer.units}`;
                    configed_layer.getElementsByTagName("p")[1].innerHTML = `Activation: ${layer.activation}`;
                    configed_layer.getElementsByTagName("p")[2].innerHTML = `Return Sequence: ${layer.return_sequence?'True':'False'}`;
                    break;
                case "Linear":
                    configed_layer.getElementsByTagName("p")[0].innerHTML = `Number of Units: ${layer.unit_num}`;
                    configed_layer.getElementsByTagName("p")[1].innerHTML = `Activation: ${layer.activation.split('_').join(' ')}`;
                    break;
                case "Embedding":
                    configed_layer.getElementsByTagName("p")[0].innerHTML = `Input Dimension: ${layer.input_dim}`;
                    configed_layer.getElementsByTagName("p")[1].innerHTML = `Output Dimension: ${layer.output_dim}`;
                    if (framework !== "PyTorch"){
                        configed_layer.getElementsByTagName("p")[2].innerHTML = `Input Length: ${layer.input_length}`;
                    }
                    break;
                case "Activation":
                    configed_layer.getElementsByTagName("p")[0].innerHTML = `Type: ${layer.type}`;
                    break;
                case "Dropout":
                    configed_layer.getElementsByTagName("p")[0].innerHTML = `Probability: ${layer.prob}`;
                    break;
                case "Batch Norm 1D":
                case "Batch Norm 2D":
                case "Batch Norm 3D":
                    configed_layer.getElementsByTagName("p")[0].innerHTML = `Number of Features: ${layer.param_num}`;
                    break;
            }
}

module.exports = change_desc;