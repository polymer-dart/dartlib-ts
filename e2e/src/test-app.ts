import { PolymerElement, html } from "@polymer/polymer/polymer-element";
import { customElement, property } from '@polymer/decorators';
import '@polymer/paper-button';
import { DartList, DartString, DartDuration, DartIterable } from 'typescript_dart/core';
import { Future, DartStream } from 'typescript_dart/async';

/**
 * @customElement
 * @polymer
 */
@customElement('test-app')
class PlaygroundApp extends PolymerElement {
    stream:DartStream<string>;
    stop:boolean=false;

    @property({ type: Number })
    pageSelected: number = 0;

    static get template() {
        return html`<p>
        Click in the button to see some funny dart stuff.
        </p>
        <p>
        <paper-button on-click='doSomething'>Do it!</paper-button>
        <paper-button on-click='doSomethingAsync'>Do it (async)!</paper-button>
        </p>
        <p>
        <paper-button on-click='startPeriodic'>Start Periodic</paper-button>
        <paper-button on-click='stopPeriodic'>Stop Periodic</paper-button>
        </p>`;
    }

    doSomething() {
        let s = new DartList.literal(1, 2, 3);
        s.expand((n) => new DartList.generate(n, (i) => new DartString(`Hello ${n}-${i}`))).forEach((n) => {
            console.log("Ciao " + n);
        });

    }

    async doSomethingAsync() {
        let f = new Future.delayed<string>(new DartDuration({ seconds: 4 }), () => {
            return new DartString.fromCharCodes(new DartIterable.generate(50, (i) => i + 65)).valueOf();
        });
        console.log(`result : ${await f}`);
    }

    async startPeriodic() {
        this.stream = new DartStream.periodic<string>(new DartDuration({seconds:1}),(count)=>{
            return `Tick ${count}`;
        });
        this.stop=false;
        console.log("Started");
        for await (let s of this.stream) {
            console.log(s);
            if (s == 'Tick 10') {
                throw Error("When exception");
            }
            if (this.stop) {
                break;
            }
        }
        this.stream=null;
        console.log("Stopped");
    }

    stopPeriodic() {
        this.stop=true;
    }
}
