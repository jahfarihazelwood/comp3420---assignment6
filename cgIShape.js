class cgIShape {
    constructor () {
        this.points = [];
        this.bary = [];
        this.indices = [];
    }
    
    addTriangle (x0,y0,z0,x1,y1,z1,x2,y2,z2) {
        var nverts = this.points.length / 4;
        
        // push first vertex
        this.points.push(x0);  this.bary.push (1.0);
        this.points.push(y0);  this.bary.push (0.0);
        this.points.push(z0);  this.bary.push (0.0);
        this.points.push(1.0);
        this.indices.push(nverts);
        nverts++;
        
        // push second vertex
        this.points.push(x1); this.bary.push (0.0);
        this.points.push(y1); this.bary.push (1.0);
        this.points.push(z1); this.bary.push (0.0);
        this.points.push(1.0);
        this.indices.push(nverts);
        nverts++
        
        // push third vertex
        this.points.push(x2); this.bary.push (0.0);
        this.points.push(y2); this.bary.push (0.0);
        this.points.push(z2); this.bary.push (1.0);
        this.points.push(1.0);
        this.indices.push(nverts);
        nverts++;
    }
}

class Cube extends cgIShape {
    
    constructor (subdivisions) {
        super();
        this.makeCube (subdivisions);
    }
    
    makeCube (subdivisions)  {
        
        // fill in your cube code here.

        // Front face
       this.addTriangle(-0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5);
       this.addTriangle(-0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5);
    
       // Back face
       this.addTriangle(-0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5);
       this.addTriangle(-0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5);
    
       // Right face
       this.addTriangle(0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5);
       this.addTriangle(0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5);
    
       // Left face
       this.addTriangle(-0.5, -0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5);
       this.addTriangle(-0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5);
    
       // Top face
       this.addTriangle(-0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5);
       this.addTriangle(-0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5);
       
       // Bottom face
       this.addTriangle(-0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5);
       this.addTriangle(-0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5);

    }
}


class Cylinder extends cgIShape {

    constructor (radialdivision,heightdivision) {
        super();
        this.makeCylinder (radialdivision,heightdivision);
    }
    
    makeCylinder (radialdivision,heightdivision){
        // fill in your cylinder code here
        
       radialdivision = Math.max(3, radialdivision); //at least 3 slices to form a circle
       heightdivision = Math.max(1, heightdivision); //at least 1 vertical division
       const radius = 0.5;
       const halfHeight = 0.5;

       // Top and bottom center points
       const topY = halfHeight;
       const bottomY = -halfHeight;


       // Generate side surface
       for (let i = 0; i < radialdivision; i++) {
           let theta0 = radians((i / radialdivision) * 360);
           let theta1 = radians(((i+1) / radialdivision) * 360);

       // (x,z) coordinates for these angles
           let x0 = radius * Math.cos(theta0);
           let z0 = radius * Math.sin(theta0);
           let x1 = radius * Math.cos(theta1);
           let z1 = radius * Math.sin(theta1);

       // Loop up the height of the cylinder
        for (let j = 0; j < heightdivision; j++) {
            let y0 = halfHeight - (j / heightdivision);
            let y1 = halfHeight - ((j+1) / heightdivision);

            // Two triangles per rectangle
            this.addTriangle(x0, y0, z0, x1, y0, z1, x1, y1, z1);
            this.addTriangle(x0, y0, z0, x1, y1, z1, x0, y1, z0);
        }

	// Top cap (counter-clockwise)
        this.addTriangle(0, topY, 0, x1, topY, z1, x0, topY, z0);

        // Bottom cap (clockwise)
        this.addTriangle(0, bottomY, 0, x0, bottomY, z0, x1, bottomY, z1);
        }
    }
}

  

class Cone extends cgIShape {

    constructor (radialdivision, heightdivision) {
        super();
        this.makeCone (radialdivision, heightdivision);
    }
    
    
    makeCone (radialdivision, heightdivision) {
    
        // Fill in your cone code here.

       radialdivision = Math.max(3, radialdivision);
       heightdivision = Math.max(1, heightdivision);    

       const radius = 0.5;
       const height = 1.0;
       const baseY = -0.5;
           

       // Side surface
       for (let i = 0; i < radialdivision; i++) {
           let theta0 = radians((i / radialdivision) * 360);
           let theta1 = radians(((i+1) / radialdivision) * 360);

       //Base edge coordinates
           let x0 = radius * Math.cos(theta0);
           let z0 = radius * Math.sin(theta0);
           let x1 = radius * Math.cos(theta1);
           let z1 = radius * Math.sin(theta1);

       //Stacked layers of cone
           for (let j = 0; j < heightdivision; j++) {
               let t0 = j / heightdivision;
               let t1 = (j + 1) / heightdivision;

      //Shrinking radius as we go up
               let r0 = radius * (1 - t0);
               let r1 = radius * (1 - t1);
       //Heights for this section
               let y0 = baseY + t0 * height;
               let y1 = baseY + t1 * height;

       // Four corner points for this layr segment
               let x0a = r0 * Math.cos(theta0);
               let z0a = r0 * Math.sin(theta0);
               let x1a = r0 * Math.cos(theta1);
               let z1a = r0 * Math.sin(theta1);

               let x0b = r1 * Math.cos(theta0);
               let z0b = r1 * Math.sin(theta0);
               let x1b = r1 * Math.cos(theta1);
               let z1b = r1 * Math.sin(theta1);

            this.addTriangle(x0a, y0, z0a,   x0b, y1, z0b,   x1a, y0, z1a);
            this.addTriangle(x0b, y1, z0b,   x1b, y1, z1b,   x1a, y0, z1a);
        }

	// Base cap
        this.addTriangle(0, baseY, 0, x0, baseY, z0, x1, baseY, z1);
        }
    }
}
    
class Sphere extends cgIShape {

    constructor (slices, stacks) {
        super();
        this.makeSphere (slices, stacks);
    }
    
    makeSphere (slices, stacks) {
        // fill in your sphere code here

       slices = Math.max(3, slices);
       stacks = Math.max(2, stacks);
       const radius = 0.5;

      //Loop through stacks
       for (let i = 0; i < stacks; i++) {
           let phi0 = Math.PI * (i / stacks);
           let phi1 = Math.PI * ((i + 1) / stacks);

      //Loop through slices
           for (let j = 0; j < slices; j++) {
               let theta0 = 2 * Math.PI * (j / slices);
               let theta1 = 2 * Math.PI * ((j + 1) / slices);

       //Four points of each rectangular patch
            let x0 = radius * Math.sin(phi0) * Math.cos(theta0);
            let y0 = radius * Math.cos(phi0);
            let z0 = radius * Math.sin(phi0) * Math.sin(theta0);

            let x1 = radius * Math.sin(phi0) * Math.cos(theta1);
            let y1 = radius * Math.cos(phi0);
            let z1 = radius * Math.sin(phi0) * Math.sin(theta1);

            let x2 = radius * Math.sin(phi1) * Math.cos(theta0);
            let y2 = radius * Math.cos(phi1);
            let z2 = radius * Math.sin(phi1) * Math.sin(theta0);

            let x3 = radius * Math.sin(phi1) * Math.cos(theta1);
            let y3 = radius * Math.cos(phi1);
            let z3 = radius * Math.sin(phi1) * Math.sin(theta1);

      //Two triangles per rectangle
            this.addTriangle(x0, y0, z0, x2, y2, z2, x1, y1, z1);
            this.addTriangle(x1, y1, z1, x2, y2, z2, x3, y3, z3);
            }
       }
    }
}

function radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}
