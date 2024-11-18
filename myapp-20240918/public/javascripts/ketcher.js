

function newketcher(){
  var ketcherFrame = document.getElementById('ketcherframe');
  var ketcher = null;
  if ('contentDocument' in ketcherFrame) 
    ketcher = ketcherFrame.contentWindow.ketcher;  
  else // IE7
    ketcher = document.frames['ketcherframe'].window.ketcher;
  console.log(ketcher)
  return ketcher
}



function newketcher_multi(){
  var ketcherFrame = document.getElementById('ketcherframemulti');
  var ketcher = null;
  if ('contentDocument' in ketcherFrame) 
    ketcher = ketcherFrame.contentWindow.ketcher;  
  else // IE7
    ketcher = document.frames['ketcherframemulti'].window.ketcher;
  console.log(ketcher)
  return ketcher
}

function newketcher_condition(){
  var ketcherFrame = document.getElementById('ketcherframecondition');
  var ketcher = null;
  if ('contentDocument' in ketcherFrame) 
    ketcher = ketcherFrame.contentWindow.ketcher;  
  else // IE7
    ketcher = document.frames['ketcherframemulti'].window.ketcher;
  console.log(ketcher)
  return ketcher
}


async function startsubmit(){
  var moleculeInput = document.getElementById('inputSmiles').value;
  console.log('Input value changed:', moleculeInput);
  ketcher=newketcher();
  ketcher.setMolecule(moleculeInput); 
  
  
  try {
    const png = true; // 或者根据需要设置为 false 或其他选项
    const imageBlob = await ketcher.generateImage(moleculeInput, {outputFormat: 'png',
    bondThickness: '2'});
    // 创建一个图像元素并设置其源为生成的图像 Blob
    const imageElement = document.createElement("img");

    // const reader = new FileReader();
    // reader.onload = function () {
    //     const img = new Image();
    //     img.onload = function () {
    //         // 图像加载完成后，设置图像元素的宽度和高度
    //         imageElement.width = img.width;
    //         imageElement.height = img.height;
    //         // 将图像元素添加到页面上的某个容器中
    //         const container = document.getElementById("target_molecule_view");
    //         container.innerHTML = "";
    //         container.appendChild(imageElement);
    //     };
    //     img.src = reader.result;
    // };
    // reader.readAsDataURL(imageBlob);
    imageElement.width = 152 ;  // Replace with your desired width
    imageElement.height = 70;  // Replace with your desired height
    imageElement.src = URL.createObjectURL(imageBlob);
    // 将图像元素添加到页面上的某个容器中
    const container = document.getElementById("target_molecule_view");
    container.innerHTML = "";
    container.appendChild(imageElement);
  } catch (error) {
    console.log("Error generating or displaying the molecule image:", error);
  }}

async function startsubmit1(){
  // var moleculeInput = document.getElementById('inputSmiles').value;
  // console.log('Input value changed:', moleculeInput);
  ketcher=newketcher();
  try {
    const smiles= await ketcher.getSmiles();
    // const result= await smiles;
    const inputSmiles = document.getElementById('inputSmiles');
    inputSmiles.value = '';
    inputSmiles.value= smiles
    // const imageBlob = await ketcher.generateImage(smiles,{outputFormat: 'svg',
    // bondThickness: '2', });
    // // 创建一个图像元素并设置其源为生成的图像 Blob
    // const imageElement = document.createElement("img");
    // imageElement.width = 152 ;  // Replace with your desired width
    // imageElement.height = 70;  // Replace with your desired height
    // imageElement.src = URL.createObjectURL(imageBlob);
    // // 将图像元素添加到页面上的某个容器中
    // const container = document.getElementById("target_molecule_view");
    // container.innerHTML = "";
    // container.appendChild(imageElement);
  } catch (error) {
    console.log("Error generating or displaying the molecule image:", error);
  }
}

async function startsubmit2(){
  var moleculeInput = document.getElementById('inputSmiles2').value;
  console.log('Input value changed:', moleculeInput);
  ketcher=newketcher_multi();
  ketcher.setMolecule(moleculeInput); 
  
  
  // try {
  //   const png = true; // 或者根据需要设置为 false 或其他选项
  //   const imageBlob = await ketcher.generateImage(moleculeInput, {outputFormat: 'png',
  //   bondThickness: '2'});
  //   // 创建一个图像元素并设置其源为生成的图像 Blob
  //   const imageElement = document.createElement("img");
  //   imageElement.width = 152 ;  // Replace with your desired width
  //   imageElement.height = 70;  // Replace with your desired height
  //   imageElement.src = URL.createObjectURL(imageBlob);
  //   // 将图像元素添加到页面上的某个容器中
  //   const container = document.getElementById("target_molecule_view");
  //   container.innerHTML = "";
  //   container.appendChild(imageElement);
  // } catch (error) {
  //   console.log("Error generating or displaying the molecule image:", error);
  // }
}

async function startsubmit3(){
  ketcher= await newketcher_multi();
  try {
    const smiles= await ketcher.getSmiles();
    // const result= await smiles;
    const inputSmiles = document.getElementById('inputSmiles2');
    inputSmiles.value = '';
    inputSmiles.value= smiles
  } catch (error) {
    console.log("Error generating or displaying the molecule image:", error);
  }
}

async function startsubmit4(){
  var moleculeInput = document.getElementById('inputSmiles3').value;
  console.log('Input value changed:', moleculeInput);
  ketcher=newketcher_condition();
  ketcher.setMolecule(moleculeInput); 
  
}

async function startsubmit5(){
  ketcher= await newketcher_condition();
  try {
    const smiles= await ketcher.getSmiles();
    // const result= await smiles;
    const inputSmiles = document.getElementById('inputSmiles3');
    inputSmiles.value = '';
    inputSmiles.value= smiles
  } catch (error) {
    console.log("Error generating or displaying the molecule image:", error);
  }
}