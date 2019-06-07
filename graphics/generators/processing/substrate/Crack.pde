class Crack {
  PVector pstart;
  float x, y;
  float t;    // direction of travel in degrees
  CrackTracer tracer;
  // sand painter
  //SandPainter sp;

  Crack() {
    //at this location create new entry with id in cracktracer
    //tracer = new CrackTracer();
    // find placement along existing crack
    findStart();
    //sp = new SandPainter();
  }

  void findStart() {
    // pick random point
    int px = 0;
    int py = 0;

    // shift until crack is found
    boolean found = false;
    int timeout = 0;
    while ((!found) || (timeout++ > 1000)) {
      px = int(random(dimx));
      py = int(random(dimy));
      if (cgrid[py*dimx+px] < 10000) {
        found = true;
      }
    }

    if (found) {
      // start crack
      int start = cgrid[py*dimx+px];

      if (random(100) < 50) {

        start-=90+int(random(-2, 2.1));
      } else {

        start+=90+int(random(-2, 2.1));
      }
      startCrack(px, py, start);
    } else {
      //println("timeout: "+timeout);
    }
  }

  void startCrack(int X, int Y, int T) {
    this.x=X;
    this.y=Y;
    this.t=T;//%360;
    this.x+=0.61*cos(t*PI/180);
    this.y+=0.61*sin(t*PI/180);
    //ellipse(this.x, this.y, 10, 10);
    //delay(100);
    pstart = new PVector(this.x, this.y);
  }

  void move() {
    // continue cracking
    this.x+=0.42*cos(t*PI/180);
    this.y+=0.42*sin(t*PI/180); 
    //x = (int) (sin(radians(x))) * 50;
    //y = (int) (sin(radians(y))) * 50;
    // bound check
    float z = 0.33;
    int cx = (int) this.x;// int(x+random(-z, z));  // add fuzz
    int cy = (int) this.y;//int(y+random(-z, z));

    // draw sand painter
    //regionColor();

    // draw black crack
    stroke(0, 85);

    point(this.x+random(-z, z), this.y+random(-z, z));

    //constrain to area
    if ((cx>=0) && (cx<dimx) && (cy>=0) && (cy<dimy)) {

      // safe to check

      if ((cgrid[cy*dimx+cx]>10000) || (abs(cgrid[cy*dimx+cx]-t)<5)) {
        // continue cracking
        cgrid[cy*dimx+cx]=int(t);
      } else if (abs(cgrid[cy*dimx+cx]-t) > 2) {

        // crack encountered (not self), stop cracking
        //tracer.end = new PVector(this.x, this.y);
        //ellipse(cx,cy, 10,10);

        traces.add(new CrackTracer(pstart, new PVector(this.x, this.y)));
        findStart();
        makeCrack();
      }
    } else {
      // out of bounds, stop cracking
      //tracer.end = new PVector(this.x, this.y);
      //ellipse(cx,cy, 10,10);
      traces.add(new CrackTracer(pstart, new PVector(this.x, this.y)));
      findStart();
      makeCrack();
    }
  }

  //void regionColor() {
  //  // start checking one step away
  //  float rx=x;
  //  float ry=y;
  //  boolean openspace=true;

  //  // find extents of open space
  //  while (openspace) {
  //    // move perpendicular to crack
  //    rx+=0.81*sin(t*PI/180);
  //    ry-=0.81*cos(t*PI/180);
  //    int cx = int(rx);
  //    int cy = int(ry);
  //    if ((cx>=0) && (cx<dimx) && (cy>=0) && (cy<dimy)) {
  //      // safe to check
  //      if (cgrid[cy*dimx+cx]>10000) {
  //        // space is open
  //      } else {
  //        openspace=false;
  //      }
  //    } else {
  //      openspace=false;
  //    }
  //  }
  //  // draw sand painter
  //  //sp.render(rx, ry, x, y);
  //}
}
