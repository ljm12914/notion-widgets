(()=>{
//#region 定义自定义元素
    class Countdown extends HTMLElement{
        constructor(){
            super();
            const shadow = this.attachShadow({mode: "closed"});
            shadow.appendChild(document.getElementById("countdown").content.cloneNode(true));
        }
    }
    customElements.define("count-down", Countdown);
    class Noargs extends HTMLElement{
        constructor(){
            super();
            const shadow = this.attachShadow({mode: "closed"});
            shadow.appendChild(document.getElementById("noargs").content.cloneNode(true));
        }
    }
    customElements.define("no-args", Noargs);
    class Reached extends HTMLElement{
        constructor(){
            super();
            const shadow = this.attachShadow({mode: "closed"});
            shadow.appendChild(document.getElementById("reached").content.cloneNode(true));
        }
    }
    customElements.define("reach-ed", Reached);
//#endregion
//#region day.js 交互
    const
        arg = location.search.substring(1, location.search.length).replace("_", " "),
        root = document.getElementById("root");
    dayjs.extend(dayjs_plugin_customParseFormat);
    dayjs.extend(dayjs_plugin_duration);
    const
        finalDate = dayjs(arg, [
            "YYYY.M.D HH:mm:ss", "YY.M.D HH:mm:ss", "M.D HH:mm:ss",
            "YYYY.M.D HH:mm",    "YY.M.D HH:mm",    "M.D HH:mm",
            "YYYY.M.D HH",       "YY.M.D HH",       "M.D HH",
        ], true);
    let duration = dayjs.duration(finalDate.diff(dayjs()));
//#endregion
//#region 显示并更新倒计时
    updateCountdown();
    //必须用 var 因为会在创建这个前就访问！
    var id = setInterval(updateCountdown, 999);
    function updateCountdown(){
        root.innerHTML = "";
        duration = dayjs.duration(finalDate.diff(dayjs()));
        if(duration.asMilliseconds() < 0){
            if(id) clearInterval(id);
            const reachedEl = document.createElement("reach-ed");
            reachedEl.appendChild(createSlot("date",
                `${finalDate.year()}.${finalDate.month() + 1}.${finalDate.date()} ${(finalDate.hour()+"").padStart(2, "0")}:${(finalDate.minute()+"").padStart(2, "0")}:${(finalDate.second()+"").padStart(2, "0")}`
            ));
            root.appendChild(reachedEl);
        }
        else{
            const countDownArray = [
                [duration.years(), "年"],
                [duration.months(), "月"],
                [duration.days(), "天"],
                [duration.hours(), "小时"],
                [duration.minutes(), "分钟"],
                [duration.seconds(), "秒"]
            ];
            for(let i = 0; i < countDownArray.length; i++) if(countDownArray[i][0] >= 0) showCountdown(countDownArray[i][0], countDownArray[i][1]);
        }
    }
    /**@type {(data :number, unit :string)=>void}*/
    function showCountdown(data, unit){
        const dataEl = createSlot("data", data), unitEl = createSlot("unit", unit), countDownEl = document.createElement("count-down");
        countDownEl.appendChild(dataEl);
        countDownEl.appendChild(unitEl);
        root.appendChild(countDownEl);
    }
//#endregion
    /**方便构建 `slot`。
     * @type {(name :string, value :string)=>HTMLSpanElement}
    */
    function createSlot(name, value){
        const slot = document.createElement("span");
        slot.setAttribute("slot", name);
        slot.textContent = value;
        return slot;
    }
})();