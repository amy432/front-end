import { Component, STATE,ATTRIBUTE} from "./framework.js";
import {enableGesture} from "./gesture.js";
import {Timeline,Animation} from "./animation.js";

// import 之后再 export
export {STATE,ATTRIBUTE} from "./framework.js";

export class Carousel extends Component {
    constructor() {
        super();        
    }    

    render() {
        // console.log(this.attributes.src);
        this.root = document.createElement("div");
        this.root.classList.add("carousel");
        for (let record of this[ATTRIBUTE].src) {
            let child = document.createElement("div");
            child.style.backgroundImage = `url('${record}')`;
         //   child.style.display = "none";
            this.root.appendChild(child);
        }

        enableGesture(this.root);
        let timeline = new Timeline;
        timeline.start();

        let handler = null;

        let children = this.root.children;
        
        this[STATE].position = 0;

        let t = 0;
        let ax = 0;

        this.root.addEventListener("start",event => {
            timeline.pause();
            clearInterval(handler);
            if(Date.now() - t < 500) {
                let progress = (Date.now() - t) / 500;
                ax = ease(progress) * 500 - 500;
            } else {
                ax = 0;
            }            
        });

        this.root.addEventListener("tap",event => {
            this.triggerEvent("click",{
                data:this[STATE].src[this[STATE].position],
                position:this[STATE].position 
            });
        });

        this.root.addEventListener("pan",event => {
            let x = event.clientX - event.startX - ax;
            let current = this[STATE].position - ((x - x % 500) / 500);
            for(let offset of [-1,0,1]) {
                let pos = current + offset;
                pos = ( pos%children.length + children.length)%children.length;

                let child = children[pos];
                child.style.transition = "none";
                child.style.transform = `translateX(${-pos * 500 + offset * 500 + x % 500}px)`;             
            }
        });

        this.root.addEventListener("end",event => {

            timeline.reset();
            timeline.start();
            handler = setInterval(nextPicture, 3000);

            let x = event.clientX - event.startX - ax;
            let current = this[STATE].position -  Math.round(x / 500);

            let direction = Math.round((x % 500)/500);

            if(event.isFlick) {
                if(event.velocity > 0) {
                    direction = Math.ceil((x % 500)/500);
                } else {
                    direction = Math.floor((x % 500)/500);
                }
                console.log(event.velocity);
            }


            for(let offset of [-1,0,1]) {
                 let pos = current + offset;
                 pos = ( pos + children.length )%children.length;

                 let child = children[pos];
                 child.style.transition = "none";
                // child.style.transform = `translateX(${-pos * 500 + offset * 500 + x%500}px)`;
                 timeline.add(new Animation(child.style,"transorm",
                   -pos * 500 + offset * 500 + x%500, 
                   -pos * 500 + offset * 500 + direction * 500,
                   500,0,ease,v=>`translateX(${v}px)`));
            }

            this[STATE].position = this[STATE].position - ((x - x%500) /500) - direction;
            this[STATE].position = (this[STATE].position % children.length + children.length);
            this.triggerEvent("Change",{
                position:this[STATE].position 
            });
        });

        /*
        this.root.addEventListener("mousedown",event => {
              let children = this.root.children;
              let startX = event.clientX;

              let move = event => {
                //   console.log("mousemove");
                //   console.log(event.clientX,event.clientY);

                  let x = event.clientX - startX;
                  let current = position - ((x - x % 500) / 500);

                  for(let offset of [-1,0,1]) {
                      let pos = current + offset;
                      pos = ( pos + children.length )%children.length;

                      let child = children[pos];
                      child.style.transition = "none";
                      child.style.transform = `translateX(${-pos * 500 + offset * 500 + x % 500}px)`;
                  }
              };


              let up = event => {
                // console.log("mouseup");
                let x = event.clientX - startX;
                position = position -  Math.round(x / 500);

                for(let offset of [0,- Math.sign(Math.round(x / 500)-x + 250 * Math.sign(x))]) {
                    let pos = position + offset;
                    pos = ( pos + children.length )%children.length;

                    let child = children[pos];
                    child.style.transition = "none";
                    child.style.transform = `translateX(${-pos * 500 + offset * 500}px)`;
                }

                document.removeEventListener("mousemove",move);
                document.removeEventListener("mouseup",up);
              };

              document.addEventListener("mousemove", move);
              document.addEventListener("mouseup",up);
        });
        */
      
        let nextPicture = ()=> {
            let children = this.root.children;
            let nextPosition = (this[STATE].position +1) % children.length;

            let current = children[this[STATE].position];
            let next = children[nextPosition];
         
            t = Date.now();

            timeline.add(new Animation(current.style,"transorm",
                - this[STATE].position * 500, -500 - this[STATE].position * 500,500,0,ease,v=>`translateX(${v}px)`));

            timeline.add(new Animation(next.style,"transorm",
                500 - nextPosition * 500, - nextPosition * 500,500,0,ease,v=>`translateX(${v}px)`));

            this[STATE].position = nextPosition;
            this.triggerEvent("Change",{
                position:this[STATE].position 
            });
            
        };


        handler = setInterval(nextPicture,3000);

        return this.root;
    }   

}