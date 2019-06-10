// Substrate Watercolor
// j.tarbell   June, 2004
// Albuquerque, New Mexico
// complexification.net

// Processing 0085 Beta syntax update
// j.tarbell   April, 2005

// Edits for exporting GCode for CityLAB
// Fabian Morón Zirfas June, 2019

import java.util.Calendar;
ArrayList <CrackTracer> traces;
PrintWriter outputgc;
PrintWriter outputsvg;

int dimx = 500;
int dimy = 500;
int num = 0;
int maxnum = 200;

// grid of cracks
int[] cgrid;
Crack[] cracks;

// color parameters
//int maxpal = 512;
//int numpal = 0;
//color[] goodcolor = new color[maxpal];

// sand painters
//SandPainter[] sands;

// MAIN METHODS ---------------------------------------------

void setup() {
  size(1189, 841);
  dimx = width;
  dimy = height;
  //  size(dimx,dimy,P3D);
  background(255);
  //takecolor("bild-47.jpeg");
  traces = new ArrayList<CrackTracer>();
  cgrid = new int[dimx*dimy];
  cracks = new Crack[maxnum];

  begin();
}

void draw() {
  // crack all cracks
  for (int n = 0; n < num; n++) {
    cracks[n].move();
  }
  //println(cgrid);
}


String timestamp() {
  // https://dzone.com/articles/java-string-format-examples
  Calendar now = Calendar.getInstance();
  return String.format("%1$ty%1$tm%1$td_%1$tH%1$tM%1$tS", now);
}
void mousePressed() {
  String tmstmp = timestamp();
  outputgc = createWriter("out/substrate-" + tmstmp + ".gc");
  outputsvg = createWriter("out/substrate-" + tmstmp + ".svg");


  outputgc.println("G21 (Set Pixels to Unit in mm)");
  outputgc.println("G90 (Absolute distance mode)");
  outputgc.println("F3125 (Feedrate)");
  outputgc.println("G0 Z10");

  outputsvg.println(String.format("<svg width=\"%1$spx\" height=\"%2$spx\" viewBox=\"0 0 %1$s %2$s\" xmlns=\"http://www.w3.org/2000/svg\"  version=\"1.1\"  xmlns:xlink=\"http://www.w3.org/1999/xlink\">", width, height));
  outputsvg.println("<title>Citylab Plotter A0</title>");
  outputsvg.println("<desc>Created with Processing</desc>");
  outputsvg.println("  <g id=\"Citylab-Substrate-A0\" stroke=\"black\" stroke-width=\"0.5\" fill=\"none\" fill-rule=\"evenodd\">");

  for (CrackTracer t : traces) {
    outputgc.println(String.format("G0 X%s Y%s", t.start.x, t.start.y));
    outputgc.println("G1 Z3");
    outputgc.println(String.format("G1 X%s Y%s", t.end.x, t.end.y));
    outputgc.println("G0 Z10");
    outputsvg.println(String.format("<line x1=\"%1$spx\" y1=\"%2$spx\" x2=\"%3$spx\" y2=\"%4$spx\" />", t.start.x, t.start.y, t.end.x, t.end.y));
    //println(t.start, t.end);
  }

  outputsvg.println("  </g>");
  outputsvg.println("</svg>");
  
  outputgc.flush();
  outputgc.close();
  
  outputsvg.flush();
  outputsvg.close();
  begin();
}


// METHODS --------------------------------------------------

void makeCrack() {
  if (num < maxnum) {
    // make a new crack instance
    cracks[num] = new Crack();
    num++;
  }
}


void begin() {
  // erase crack grid
  for (int y=0; y<dimy; y++) {
    for (int x=0; x<dimx; x++) {
      cgrid[y*dimx+x] = 10001;
    }
  }

  // make random crack seeds
  // only places values in the cgrid
  // does not create something
  // is only there to have some values in the list
  for (int k=0; k<16; k++) {

    // select random from the grid
    int i = int(random(dimx * dimy - 1));

    cgrid[i]=int(random(360));
  }

  // make just ten cracks
  num=0;
  for (int k=0; k<10; k++) {

    makeCrack();
  }
  background(255);
}



// COLOR METHODS ----------------------------------------------------------------

//color somecolor() {
//  // pick some random good color
//  return goodcolor[int(random(numpal))];
//}

//void takecolor(String fn) {
//  PImage b;
//  b = loadImage(fn);
//  image(b, 0, 0);

//  for (int x=0; x<b.width; x++) {
//    for (int y=0; y<b.height; y++) {
//      color c = get(x, y);
//      boolean exists = false;
//      for (int n=0; n<numpal; n++) {
//        if (c==goodcolor[n]) {
//          exists = true;
//          break;
//        }
//      }
//      if (!exists) {
//        // add color to pal
//        if (numpal<maxpal) {
//          goodcolor[numpal] = c;
//          numpal++;
//        }
//      }
//    }
//  }
//}




// OBJECTS -------------------------------------------------------




// j.tarbell   June, 2004
// Albuquerque, New Mexico
// complexification.net
