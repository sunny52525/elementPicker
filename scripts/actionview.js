class EventEmitter {
    constructor() {
        this._events = {};
    }

    on(evt, listener) {
        (this._events[evt] || (this._events[evt] = [])).push(listener);
        return this;
    }

    emit(evt, arg) {
        (this._events[evt] || []).slice().forEach(lsn => lsn(arg));
    }
}


class actionview extends EventEmitter {
    constructor(model, elements) {
        super();
        this.model = model;
        this.elements = elements;
        let buttons = this.elements.buttons;
        console.log(buttons)

        for (let i = 0; i < buttons.childElementCount; ++i) {

            buttons.children[i].addEventListener('click', () => {
                let cmd = buttons.children[i].getAttribute('data-cmd');
                if (cmd === "createLink") {

                    this.emit("createLink", cmd);
                } else {
                    this.emit("other", cmd);

                }
                if (cmd === "showCode") {
                    this.emit("showCode");
                }
            })
        }
    }
}
