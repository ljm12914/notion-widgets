(()=>{
    class Countdown extends HTMLElement{
        constructor(){
            super();
            let shadow = this.attachShadow({mode: "closed"});
            shadow.appendChild(document.getElementById("countdown").content.cloneNode(true));
        }
    }
    class Noargs extends HTMLElement{
        constructor(){
            super();
            let shadow = this.attachShadow({mode: "closed"});
            shadow.appendChild(document.getElementById("noargs").content.cloneNode(true));
        }
    }
    customElements.define("count-down", Countdown);
    customElements.define("no-args", Noargs);
    const
        arg = (()=>{
            let s = location.search;
            s = s.substring(1, s.length);
            s = s.split("&");
            for(let i = 0; i < s.length; i++){
                let sis = s[i].split("=");
                if(sis[0] === "d") return sis[1];
            }
            return null;
        })(),
        root = document.getElementById("root");
    if(arg === null){
        root.appendChild(document.createElement("no-args"));
        return;
    }
    let [date, time] = arg.split("_"), finalDate;
    if(date === undefined || date === ""){
        if(time === undefined){
            root.appendChild(document.createElement("no-args"));
            return;
        }
        else{ //这里浏览器Date不认，需要自行填充
            console.log(date, time);
        }
    }
    else finalDate = new Date(arg.replace("_", " ")); //if(time === undefined) //这里默认是零点
    console.log(finalDate);
})();