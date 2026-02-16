
document.body.innerHTML = '<style>div{color: grey;text-align:center;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;width:500px;height:100px;}</style><body><div id="loading"><p>This could take a while, please give it at least 5 minutes to render.</p><br><h1 class="spin">⏳</h1><br><h3>Press <strong>?</strong> for shortcut keys</h3><br><p><small>Output contains an embedded blueprint for creating an IRL wall sculpture</small></p></div></body>';
paper.install(window);
window.onload = function() {

document.body.innerHTML = '<style>body {margin: 0px;text-align: center;}</style><canvas resize="true" style="display:block;width:100%;" id="myCanvas"></canvas>';

setquery("fxhash",$fx.hash);
var initialTime = new Date().getTime();

//file name 
var fileName = $fx.hash;

var canvas = document.getElementById("myCanvas");

paper.setup('myCanvas');
paper.activate();

//console.log(tokenData.hash)
console.log('#'+$fx.iteration)

canvas.style.background = "white";

//Set a seed value for Perlin
var seed = Math.floor($fx.rand()*10000000000000000);

//initialize perlin noise 
var noise = new perlinNoise3d();
noise.noiseSeed(seed);

//read in query strings
var qcolor1 = "AllColors";
if(new URLSearchParams(window.location.search).get('c1')){qcolor1 = new URLSearchParams(window.location.search).get('c1')}; //colors1
var qcolor2 = "None";
if(new URLSearchParams(window.location.search).get('c2')){qcolor2 = new URLSearchParams(window.location.search).get('c2')}; //colors2
var qcolor3 = "None";
if(new URLSearchParams(window.location.search).get('c3')){qcolor3 = new URLSearchParams(window.location.search).get('c3')}; //colors3
var qcolors = R.random_int(1,6);
if(new URLSearchParams(window.location.search).get('c')){qcolors = new URLSearchParams(window.location.search).get('c')}; //number of colors
var qsize = "2";
if(new URLSearchParams(window.location.search).get('s')){qsize = new URLSearchParams(window.location.search).get('s')}; //size
var qcomplexity = R.random_int(1,10);
if(new URLSearchParams(window.location.search).get('d')){qcomplexity = new URLSearchParams(window.location.search).get('d')}; //size

var qorientation =R.random_int(1,2) < 2 ? "portrait" : "landscape";
var qframecolor = R.random_int(0,3) < 1 ? "White" : R.random_int(1,3) < 2 ? "Mocha" : "Random";
var qtype = "Squiggle"; console.log(qtype);
var qframetype = R.random_int(1,2) < 1 ? "Circle" : "Square";
var qcenter = R.random_int(300,600);
if (qorientation=="portrait"){qcenter = R.random_int(300,700)}else{qcenter = R.random_int(200,600)}
console.log("qcetner"+qcenter);
var qmatwidth = R.random_int(50,75);
var qnwaves = R.random_int(1,6);console.log(qnwaves);
var qaspectratio = "4:5";
if(new URLSearchParams(window.location.search).get('ratio')){qaspectratio = new URLSearchParams(window.location.search).get('ratio')}; //size
console.log(qaspectratio);

//FXparams

definitions = [
    {
        id: "layers",
        name: "Layers",
        type: "number",
        default: 12,
        options: {
            min: 6,
            max: 24,
            step: 1,
        },  
    },
    {
        id: "orientation",
        name: "Orientation",
        type: "select",
        default: qorientation,
        options: {options: ["portrait", "landscape"]},
    },
    {
        id: "aspectratio",
        name: "Aspect ratio",
        type: "select",
        default: qaspectratio,
        //options: {options: ["1:1","circle","4:5"]},
        options: {options: ["1:1", "2:5","3:5","4:5","54:86","296:420"]},
    },
    {
        id: "size",
        name: "Size",
        type: "select",
        default: qsize,
        options: {options: ["1", "2", "3"]},
    },
    {
        id: "colors",
        name: "Max # of colors",
        type: "number",
        default: qcolors,
        options: {
            min: 1,
            max: 6,
            step: 1,
        },  
    },
    {
        id: "colors1",
        name: "Pallete 1",
        type: "select",
        default: qcolor1,
        options: {options: palleteNames},
    },
    {
        id: "colors2",
        name: "Pallete 2",
        type: "select",
        default: qcolor2,
        options: {options: palleteNames},
    },
    {
        id: "colors3",
        name: "Pallete 3",
        type: "select",
        default: qcolor3,
        options: {options: palleteNames},
    },
    {
        id: "framecolor",
        name: "Frame color",
        type: "select",
        default: qframecolor,
        options: {options: ["Random","White","Mocha"]},
    }, 
    {
        id: "type",
        name: "Type",
        type: "select",
        default: qtype,
        options: {options: ["Squiggle","Wave"]},
    },
    {
        id: "nwaves",
        name: "Number of squiggles",
        type: "number",
        default: qnwaves,
        options: {
            min: 1,
            max: 4,
            step: 1,
        },  
    },
    {
        id: "frametype",
        name: "Frame Type",
        type: "select",
        default: qframetype,
        options: {options: ["Circle","Square"]},
    },
    {
        id: "center",
        name: "Center",
        type: "number",
        default: qcenter,
        options: {
            min: 1,
            max: 1000,
            step: 1,
        },  
    },
    
    {
        id: "matwidth",
        name: "Mat size",
        type: "number",
        default: qmatwidth,
        options: {
            min: 50,
            max: 200,
            step: 10,
        },  
    },
   
    ]

//read in query strings
var qcolor1 = new URLSearchParams(window.location.search).get('c1'); //colors1



$fx.params(definitions)
var scale = $fx.getParam('size');
var stacks = $fx.getParam('layers');
var numofcolors = $fx.getParam('colors');


//Set the properties for the artwork where 100 = 1 inch
var wide = 800; 
var high = 1000; 
if ($fx.getParam('aspectratio')== "circle"){wide = 800; high = 800};
if ($fx.getParam('aspectratio')== "1:1"){wide = 800; high = 800};
if ($fx.getParam('aspectratio')== "2:5"){wide = 400; high = 1000};
if ($fx.getParam('aspectratio')== "3:5"){wide = 600; high = 1000};
if ($fx.getParam('aspectratio')== "4:5"){wide = 800; high = 1000};
if ($fx.getParam('aspectratio')== "54:86"){wide = 540; high = 860};
if ($fx.getParam('aspectratio')== "296:420"){wide =705; high = 1000};


var ratio = 1/scale;//use 1/4 for 32x40 - 1/3 for 24x30 - 1/2 for 16x20 - 1/1 for 8x10
var minOffset = ~~(7*ratio); //this is aproximatly .125"
var framewidth = ~~($fx.getParam('matwidth')*ratio*scale); 
var framradius = 0;


// Set a canvas size for when layers are exploded where 100=1in
var panelWide = 1600; 
var panelHigh = 2000; 
 
paper.view.viewSize.width = 2400;
paper.view.viewSize.height = 2400;


var colors = []; var palette = []; 

// set a pallete based on color schemes
var newPalette = [];
newPalette = this[$fx.getParam('colors1')].concat(this[$fx.getParam('colors2')],this[$fx.getParam('colors3')]);
for (c=0; c<numofcolors; c=c+1){palette[c] = newPalette[R.random_int(0, newPalette.length-1)]}  
console.log(newPalette);

//randomly assign colors to layers
for (c=0; c<stacks; c=c+1){colors[c] = palette[R.random_int(0, palette.length-1)];};

//or alternate colors
p=0;for (var c=0; c<stacks; c=c+1){colors[c] = palette[p];p=p+1;if(p==palette.length){p=0};}

console.log(colors);

if ($fx.getParam('framecolor')=="White"){colors[stacks-1]={"Hex":"#FFFFFF", "Name":"Smooth White"}};
if ($fx.getParam('framecolor')=="Mocha"){colors[stacks-1]={"Hex":"#4C4638", "Name":"Mocha"}};


var woodframe = new Path();var framegap = new Path();
var fColor = frameColors[R.random_int(0, frameColors.length-1)];
fColor = {"Hex":"#60513D","Name":"Walnut"};
var frameColor = fColor.Hex;

//adjust the canvas dimensions
w=wide;h=high;
var orientation="Portrait";
 
if ($fx.getParam('orientation')=="landscape"){wide = h;high = w;orientation="Landscape";};
if ($fx.getParam('orientation')=="portrait"){wide = w;high = h;orientation="Portrait";};

//setup the project variables
if ($fx.getParam('type')== "Squiggle"){var type = 1};
if ($fx.getParam('type')== "Wave"){var type = 0};

if ($fx.getParam('frametype')== "Circle"){var frameType = 1};
if ($fx.getParam('frametype')== "Square"){var frameType = 0};

//Set the line color
linecolor={"Hex":"#4C4638", "Name":"Mocha"};


//************* Draw the layers ************* 


sheet = []; //This will hold each layer
var px=0;var py=0;var pz=0;var prange=.1; 
var center = new Point(wide/2,high/2)
var longestDim = wide;if (wide<high){longestDim=high;}


//---- Draw the Layers


var sliceLine = high/2;
console.log("sliceLine"+sliceLine)
var gap = Math.floor(8+Math.floor(R.random_dec()*25))
var columnWidth = Math.floor((wide-(framewidth*2+100))-(R.random_dec()*400))
columnWidth = Math.floor((wide+100-(R.random_dec()*(wide))))
//var type = R.random_dec()
//var frameType = R.random_dec();
//var nwaves = R.random_dec();
var swaves1 = R.random_int(250,high-250);console.log(swaves1);
var swaves2 = R.random_int(250,high-250);console.log(swaves2);
var swaves3 = R.random_int(250,high-250);console.log(swaves3);
var swaves4 = R.random_int(250,high-250);console.log(swaves4);
var swaves5 = R.random_int(250,high-250);console.log(swaves5);
//var rotated = R.random_dec()


for (z = 0; z < stacks; z++) {
    px=0; py=0;pz=pz+prange;
    

        drawFrame(z);
    
        
            //if($fx.getParam('nwaves')== 2){squiggleCut(z,sliceLine); squiggleCut(z,sliceLine+swaves);}
            //else if($fx.getParam('nwaves')== 1){squiggleCut(z,sliceLine);}
            //else if($fx.getParam('nwaves')== 3){squiggleCut(z,sliceLine);squiggleCut(z,sliceLine+swaves);squiggleCut(z,sliceLine-swaves);}
            //else if($fx.getParam('nwaves')== 4){squiggleCut(z,sliceLine);squiggleCut(z,sliceLine+swaves);squiggleCut(z,sliceLine-swaves);squiggleCut(z,sliceLine-swaves*1.2);squiggleCut(z,sliceLine+swaves*1.2);}
        
            squiggleCut(z,swaves1);
            if($fx.getParam('nwaves') > 1) {squiggleCut(z,swaves2)};
            if($fx.getParam('nwaves') > 2) {squiggleCut(z,swaves3)};
            if($fx.getParam('nwaves') > 3) {squiggleCut(z,swaves4)};
            if($fx.getParam('nwaves') > 4) {squiggleCut(z,swaves5)};
        
        
        //if (rotated<.5){sheet[z].rotate(90,new Point(wide/2,high/2))}
       
        if ($fx.getParam('aspectratio')=="circle"){frameIt(z,1);} else {frameIt(z,0);}// finish the layer with a final frame cleanup 

        cutMarks(z);
        hanger(z);// add cut marks and hanger holes
        if (z == stacks-1) {signature(z);}// sign the top layer
        var layerCenter = new Point(wide / 2, high / 2);
        var canvasCenter = new Point(paper.view.viewSize.width / 2, paper.view.viewSize.height / 2);
        sheet[z].scale(2.2, layerCenter);
        sheet[z].translate(canvasCenter.subtract(layerCenter));
        var group = new Group(sheet[z]);
        console.log(z)//Show layer completed in console
    
}//end z loop



function normalizeAndTransformLayer(z) {
    let shape = sheet[z];

    // Convert CompoundPath to proper group of cloned paths
    if (shape instanceof CompoundPath) {
        const children = shape.children.map(child => {
            return child.clone(); // clone to detach from original compound path
        });
        shape.remove(); // remove the old compound path
        shape = new Group(children);
    } else {
        // If it's a Path, wrap it as well for uniformity
        shape = new Group([shape]);
    }

    // Now apply transforms safely
    shape.reduce(); // flatten transforms
    shape.scale(2.2);
    shape.position = paper.view.center;

    // Replace back into sheet[]
    sheet[z] = shape;
}

//--------- Finish up the preview ----------------------- 

    // Build the features and trigger an fxhash preview
    var features = {};
    features.Size =  ~~(wide/100/ratio)+" x "+~~(high/100/ratio)+" inches";
    features.Width = ~~(wide/100/ratio);
    features.Height = ~~(high/100/ratio);
    features.Depth = stacks*0.0625;
    features.Layers = stacks;
    for (l=stacks;l>0;l--){
    var key = "layer: "+(stacks-l+1)
    features[key] = colors[l-1].Name
    }
    console.log(features);
    $fx.features(features);
    paper.view.update();
    //floatingframe();
    //upspirestudio(features); //#render and send features to upspire.studio

   // add a white background layer
    outsideframe = new Path.Rectangle(new Point(0,0),new Size(wide, high), framradius)
    sheet[stacks+1] = outsideframe;
    sheet[stacks+1].style = {fillColor: "#ffffff", strokeColor: linecolor.Hex, strokeWidth: 1*ratio,shadowColor: new Color(0,0,0,[0.3]),shadowBlur: 20,shadowOffset: new Point((stacks-z)*2.3, (stacks-z)*2.3)};
    sheet[stacks+1].scale(2.2);
    sheet[stacks+1].position = new Point(paper.view.viewSize.width/2, paper.view.viewSize.height/2);
    sheet[stacks+1].sendToBack();



 //Begin send to studio.shawnkemp.art **************************************************************
     studioAPI.setApiBase('https://studio-shawnkemp-art.vercel.app');
     if(new URLSearchParams(window.location.search).get('skart')){sendAllExports()}; 

     async function sendAllExports() {
        
        paper.view.update();
        // Send canvas as PNG
        await studioAPI.sendCanvas(myCanvas, $fx.hash, $fx.hash+".png");

        // Send SVG
        await studioAPI.sendSVG(project.exportSVG({asString: true}), $fx.hash, $fx.hash+".svg");

        // send colors
        var content = JSON.stringify(features,null,2);

        // Send text/JSON
        await studioAPI.sendText(JSON.stringify(colors), $fx.hash, "Colors-"+$fx.hash+".json");

        // 2. Add frame
        floatingframe();
        paper.view.update();
        // 3. Framed PNGs (Black, White, Walnut, Maple)
        var frameOptions = [
            { name: "Black", hex: "#1f1f1f" },
            { name: "White", hex: "#f9f9f9" },
            { name: "Walnut", hex: "#60513D" },
            { name: "Maple", hex: "#ebd9c0" }
        ];
        for (var i = 0; i < frameOptions.length; i++) {
            woodframe.style = { fillColor: frameOptions[i].hex };
            var fileName = "Framed" + frameOptions[i].name + "-" + $fx.hash;
            paper.view.update();
            
            await studioAPI.sendCanvas(myCanvas,  $fx.hash, fileName+".png");
        }
        // 4. Remove frame
        floatingframe();
        // 5. Blueprint SVG
        for (var z = 0; z < stacks; z++) {
            sheet[z].style = {
                fillColor: null,
                strokeWidth: 0.1,
                strokeColor: lightburn[stacks - z - 1].Hex,
                shadowColor: null,
                shadowBlur: null,
                shadowOffset: null
            };
            sheet[z].selected = true;
        }
        paper.view.update();
        
        // Send SVG
        await studioAPI.sendSVG(project.exportSVG({asString: true}), $fx.hash, "Blueprint-" + $fx.hash+".svg");
        // 6. Plotting SVG
        for (var z = 0; z < stacks; z++) {
            sheet[z].style = {
                fillColor: null,
                strokeWidth: 0.1,
                strokeColor: plottingColors[stacks - z - 1].Hex,
                shadowColor: null,
                shadowBlur: null,
                shadowOffset: null
            };
            sheet[z].selected = true;
        }
        for (var z = 0; z < stacks; z++) {
            if (z < stacks - 1) {
                for (var zs = z + 1; zs < stacks; zs++) {
                    sheet[z] = sheet[z].subtract(sheet[zs]);
                    sheet[z].previousSibling.remove();
                }
            }
        }
        paper.view.update();
        // Send SVG
        await studioAPI.sendSVG(project.exportSVG({asString: true}), $fx.hash, "Plotting-" + $fx.hash+".svg");
        
        // Send features
        await studioAPI.sendFeatures($fx.hash, features);

        console.log("All exports sent!");
        studioAPI.signalComplete();
    }
//End send to studio.shawnkemp.art **************************************************************


      var finalTime = new Date().getTime();
    var renderTime = (finalTime - initialTime)/1000
    console.log ('Render took : ' +  renderTime.toFixed(2) + ' seconds' );


        async function refreshit() {
        await new Promise(resolve => setTimeout(resolve, 5000)); // 3 sec
        canvas.toBlob(function(blob) {saveAs(blob, tokenData.hash+' - '+renderTime.toFixed(0)+'secs.png');});
        await new Promise(resolve => setTimeout(resolve, 5000)); // 3 sec
        window.open('./index.html?testing=true', '_blank');
        }

//vvvvvvvvvvvvvvv PROJECT FUNCTIONS vvvvvvvvvvvvvvv 
 
function wavebase(z){
    start = new Point((wide/2-columnWidth/2),0) 
    size = new Size(columnWidth, high)
    path = new Path.Rectangle(start,size)
    sheet[z] = sheet[z].unite(path);
    path.remove();
    project.activeLayer.children[project.activeLayer.children.length-2].remove();
}

function circleFrame(z){
    outsideframe = new Path.Rectangle(new Point(1,1),new Size(wide-2, high-2))
    path = new Path.Circle(new Point(wide/2, high/2), wide/2-framewidth);
    path2 = outsideframe.subtract(path);
    outsideframe.remove();path.remove();
    sheet[z] = sheet[z].unite(path2);
    path2.remove();
    project.activeLayer.children[project.activeLayer.children.length-2].remove();
}

function waveCut(z){
    var lines = new Path();
    var wy=sliceLine;
    for (wx=0;wx<wide;wx=(wx+Math.floor(noise.get(wx,wy)*100))){
        wy=sliceLine+Math.floor(50-noise.get(wx,wy)*100)
        points = new Point(wx,wy)
        lines.add(points);
    }
    lines.smooth()
    lines.scale(1+noise.get(z), new Point(wide/2, sliceLine));
    mesh = PaperOffset.offsetStroke(lines, (z+1)*gap, { cap: 'round',strokeWidth: 1 })
    lines.remove();
    sheet[z] = (sheet[z].subtract(mesh));
    mesh.remove();  
    project.activeLayer.children[project.activeLayer.children.length-2].remove();
}

function squiggleCut(z,centerline){
    var lines = new Path();
    var wy=centerline;
    var stopx=20
    var maxamp = high-wy;
    
    if (wy<maxamp){maxamp=wy}
    if (maxamp>200){maxamp=200}
    console.log(maxamp);

    points = new Point(0,wy)
    lines.add(points);

    for (wx=10;wx<wide-10;wx=(wx+Math.floor(noise.get(wx/10,wy/9)*100))){
        wy=centerline+Math.floor(maxamp-(noise.get(wx/10,wy/9)*(maxamp*2)))
        points = new Point(wx,wy)
        lines.add(points);
        //console.log(wx,wy);
        stopx=wx;
        
    }
    if (stopx<wide) {points = new Point(wide,wy);lines.add(points);}
    //lines.flatten(20);
    //lines.simplify()
    //lines.smooth({ type: 'catmull-rom', factor: 1 })
    lines.simplify(0.5);
    points = new Point(wide+10,wy)
    lines.add(points);
    
    var scaleFactor = 1 + noise.get(z * 0.1) * 0.2;
    lines.scale(scaleFactor, new Point(wide/2, centerline));
    //lines.scale(Math.floor(.9+noise.get(z)), new Point(wide/2, centerline));
    mesh = PaperOffset.offsetStroke(lines, (stacks-z)*7, { cap: 'round',strokeWidth: 1 })
    lines.remove();
    sheet[z] = (sheet[z].unite(mesh));
    mesh.remove();  
    project.activeLayer.children[project.activeLayer.children.length-2].remove();
}



//^^^^^^^^^^^^^ END PROJECT FUNCTIONS ^^^^^^^^^^^^^ 




//--------- Helper functions ----------------------- 
function floatingframe(){
    var frameWide=~~(34*ratio);var frameReveal = ~~(12*ratio);
  if (framegap.isEmpty()){
        var outsideframe = new Path.Rectangle(new Point(0, 0),new Size(~~(wide+frameReveal*2), ~~(high+frameReveal*2)), framradius)
        var insideframe = new Path.Rectangle(new Point(frameReveal, frameReveal),new Size(wide, high)) 
        framegap = outsideframe.subtract(insideframe);
        outsideframe.remove();insideframe.remove();
        framegap.scale(2.2);
        framegap.position = new Point(paper.view.viewSize.width/2, paper.view.viewSize.height/2);
        framegap.style = {fillColor: '#1A1A1A', strokeColor: "#1A1A1A", strokeWidth: 1*ratio};
    } else {framegap.removeChildren()} 
    
    if (woodframe.isEmpty()){
        var outsideframe = new Path.Rectangle(new Point(0, 0),new Size(wide+frameWide*2+frameReveal*2, high+frameWide*2+frameReveal*2), framradius)
        var insideframe = new Path.Rectangle(new Point(frameWide, frameWide),new Size(wide+frameReveal*2, high+frameReveal*2)) 
        woodframe = outsideframe.subtract(insideframe);
        outsideframe.remove();insideframe.remove();
        woodframe.scale(2.2);
        woodframe.position = new Point(paper.view.viewSize.width/2, paper.view.viewSize.height/2);
        var framegroup = new Group(woodframe);
        woodframe.style = {fillColor: frameColor, strokeColor: "#1A1A1A", strokeWidth: 2*ratio,shadowColor: new Color(0,0,0,[0.5]),shadowBlur: 20,shadowOffset: new Point(10*2.2, 10*2.2)};
    } else {woodframe.removeChildren()} 
    //fileName = "Framed-"+$fx.hash;
}


function rangeInt(range,x,y,z){
    var v = ~~(range-(noise.get(x,y,z)*range*2));
    return (v);
}

// Add shape s to sheet z
function join(z,s){
    sheet[z] = (s.unite(sheet[z]));
    s.remove();
    project.activeLayer.children[project.activeLayer.children.length-2].remove();
}

// Subtract shape s from sheet z
function cut(z,s){
    sheet[z] = sheet[z].subtract(s);
    s.remove();
    project.activeLayer.children[project.activeLayer.children.length-2].remove();
}

function drawFrame(z){
    var outsideframe = new Path.Rectangle(new Point(0, 0),new Size(wide, high), framradius)
    var insideframe = new Path.Rectangle(new Point(framewidth, framewidth),new Size(wide-framewidth*2, high-framewidth*2)) 
    sheet[z] = outsideframe.subtract(insideframe);
    outsideframe.remove();insideframe.remove();
}


function solid(z){ 
    outsideframe = new Path.Rectangle(new Point(1,1),new Size(wide-1, high-1), framradius)
    //outsideframe = new Path.Circle(new Point(wide/2),wide/2)
    sheet[z] = sheet[z].unite(outsideframe);
    outsideframe.remove();
    project.activeLayer.children[project.activeLayer.children.length-2].remove();
}



function frameIt(z,round){
    //Trim to size
    var outsideframe = new Path.Rectangle(new Point(0, 0),new Size(wide, high), framradius)
    if (round==1){var outsideframe = new Path.Circle(new Point(wide/2, wide/2),wide/2)};
    sheet[z] = outsideframe.intersect(sheet[z]);
    outsideframe.remove();
    project.activeLayer.children[project.activeLayer.children.length-2].remove();

    //Make sure there is still a solid frame
    var outsideframe = new Path.Rectangle(new Point(0, 0),new Size(wide, high), framradius)
    var insideframe = new Path.Rectangle(new Point(framewidth, framewidth),new Size(wide-framewidth*2, high-framewidth*2)) 
    if (round==1){var outsideframe = new Path.Circle(new Point(wide/2, wide/2),wide/2);}
    if (round==1){var insideframe = new Path.Circle(new Point(wide/2, wide/2),wide/2-framewidth);}

    var frame = outsideframe.subtract(insideframe);
    outsideframe.remove();insideframe.remove();
    sheet[z] = sheet[z].unite(frame);
    frame.remove();
    project.activeLayer.children[project.activeLayer.children.length-2].remove();
     
    
    sheet[z].style = {fillColor: colors[z].Hex, strokeColor: linecolor.Hex, strokeWidth: 1*ratio,shadowColor: new Color(0,0,0,[0.3]),shadowBlur: 20,shadowOffset: new Point((stacks-z)*2.3, (stacks-z)*2.3)};
}

function cutMarks(z){
    if (z<stacks-1 && z!=0) {
          for (etch=0;etch<stacks-z;etch++){
                var layerEtch = new Path.Circle(new Point(50+etch*10,25),2)
                cut(z,layerEtch)
            } 
        }
}

function signature(z){
    shawn = new CompoundPath(sig);
    shawn.strokeColor = 'green';
    shawn.fillColor = 'green';
    shawn.strokeWidth = 1;
    shawn.scale(ratio*.9)
    shawn.position = new Point(wide-framewidth-~~(shawn.bounds.width/2), high-framewidth+~~(shawn.bounds.height));
    cut(z,shawn)
}

function hanger (z){
    if (z < stacks-2 && scale>0){
        var r = 30*ratio;
        rt = 19*ratio;
        if (z<3){r = 19*ratio}
        layerEtch = new Path.Rectangle(new Point(framewidth/2, framewidth),new Size(r*2, r*3), r)
        layerEtch.position = new Point(framewidth/2,framewidth);   
        cut(z,layerEtch)

        layerEtch = new Path.Rectangle(new Point(wide-framewidth/2, framewidth),new Size(r*2, r*3), r)
        layerEtch.position = new Point(wide-framewidth/2,framewidth);   
        cut(z,layerEtch)

        layerEtch = new Path.Rectangle(new Point(wide/2, framewidth/2),new Size(r*4, r*2), r)
        layerEtch.position = new Point(wide/2,framewidth/2);   
        cut(z,layerEtch)
    }
}




//--------- Interaction functions -----------------------
var interactiontext = "Interactions\nB = Blueprint mode\nV = Export SVG\nP = Export PNG\nC = Export colors as TXT\nE = Show layers\nF = Add floating frame\nL = Format for plotting"

view.onDoubleClick = function(event) {
    alert(interactiontext);
    console.log(project.exportJSON());
    //canvas.toBlob(function(blob) {saveAs(blob, tokenData.hash+'.png');});
};

document.addEventListener('keypress', (event) => {

       //Save as SVG 
       if(event.key == "v") {
        sheet[stacks+1].remove();
            var url = "data:image/svg+xml;utf8," + encodeURIComponent(paper.project.exportSVG({asString:true}));
            var key = [];for (l=stacks;l>0;l--){key[stacks-l] = colors[l-1].Name;}; 
            var svg1 = "<!--"+key+"-->" + paper.project.exportSVG({asString:true})
            var url = "data:image/svg+xml;utf8," + encodeURIComponent(svg1);
            var link = document.createElement("a");
            link.download = fileName;
            link.href = url;
            link.click();
            }


        if(event.key == "f") {
            floatingframe();
            
        }
        
        if(event.key == "1") {
            frameColor = {"Hex":"#4C46380", "Name":"Black"};
            fileName = "FramedBlack-"+$fx.hash;
            woodframe.style = {fillColor: frameColor.Hex}
        }
        if(event.key == "2") {
            frameColor = {"Hex":"#f9f9f9","Name":"White"};
            fileName = "FramedWhite-"+$fx.hash;
            woodframe.style = {fillColor: frameColor.Hex}
        }
        if(event.key == "3") {
            frameColor = {"Hex":"#60513D","Name":"Walnut"};
            fileName = "FramedWalnut-"+$fx.hash;
            woodframe.style = {fillColor: frameColor.Hex}
        }
        if(event.key == "4") {
            frameColor = {"Hex":"#ebd9c0","Name":"Maple"};
            fileName = "FramedMaple-"+$fx.hash;
            woodframe.style = {fillColor: frameColor.Hex}
        }
            
        if(event.key == "V") {
            fileName = "Vector-"+$fx.hash;
        }  


       //Format for Lightburn
       if(event.key == "b") {
        fileName = "blueprint-"+$fx.hash;
            for (z=0;z<stacks;z++){
                sheet[z].style = {fillColor: null,strokeWidth: .1,strokeColor: lightburn[stacks-z-1].Hex,shadowColor: null,shadowBlur: null,shadowOffset: null}
                sheet[z].selected = true;}
            }

       //Format for plotting
       if(event.key == "l") {
            fileName = "Plotting-"+$fx.hash;

            for (z=0;z<stacks;z++){
            sheet[z].style = {fillColor: null,strokeWidth: .1,strokeColor: plottingColors[stacks-z-1].Hex,shadowColor: null,shadowBlur: null,shadowOffset: null}
            sheet[z].selected = true;
            }
        
            for (z=0;z<stacks;z++){
                if (z<stacks-1){
                    for (zs=z+1;zs<stacks;zs++){
                        sheet[z] = sheet[z].subtract(sheet[zs]);
                        sheet[z].previousSibling.remove();
                    }
                } 
                console.log("optimizing")
            }
        }

        //new hash
        if(event.key == " ") {
            setquery("fxhash",null);
            location.reload();
            }

        //help
       if(event.key == "h" || event.key == "/") {
            alert(interactiontext);
            }
             
        //Save as PNG
        if(event.key == "p") {
            canvas.toBlob(function(blob) {saveAs(blob, fileName+'.png');});
            }

        //Export colors as txt
        if(event.key == "c") {
            content = JSON.stringify(features,null,2);
            console.log(content);
            var filename = "Colors-"+$fx.hash + ".txt";
            var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
            saveAs(blob, filename);
            }

        //send to studio.shawnkemp.art
        if(event.key == "s") {
            sendAllExports()
            }  

       //Explode the layers     
       if(event.key == "e") {   
            //floatingframe();  
            h=0;t=0;maxwidth=3000;
               for (z=0; z<sheet.length; z++) { 
               sheet[z].scale(1000/2300)   
               sheet[z].position = new Point(wide/2,high/2);        
                    sheet[z].position.x += wide*h;
                    sheet[z].position.y += high*t;
                    sheet[z].selected = true;
                    if (wide*(h+2) > panelWide) {maxwidth=wide*(h+1);h=0;t++;} else{h++};
                    }  
            paper.view.viewSize.width = maxwidth;
            paper.view.viewSize.height = high*(t+1);
           }
 
}, false); 
}