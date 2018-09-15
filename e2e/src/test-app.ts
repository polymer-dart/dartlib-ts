import { PolymerElement, html } from "@polymer/polymer/polymer-element";
import { MutableData } from '@polymer/polymer/lib/mixins/mutable-data';

import { customElement, property } from '@polymer/decorators';
import '@polymer/paper-button';
import { DartList, DartString, DartDuration, DartIterable } from 'typescript_dart/core';
import { Future, DartStream } from 'typescript_dart/async';
import { $with } from 'typescript_dart/utils';

/**
 * @customElement
 * @polymer
 */
@customElement('test-app')
class PlaygroundApp extends MutableData(PolymerElement) {
    stream: DartStream<string>;
    stop: boolean = false;
    @property({ type: Array, notify: true })
    messages: DartList<string> = new DartList.literal<string>('console');

    @property({ type: Number })
    pageSelected: number = 0;

    static get template() {
        return html`
        <style>
            .console {
                height: 200px;
                overflow: auto;
                padding:1em;
                background-color: lightgrey;
            }
        </style>
        <p>
        Click in the button to see some funny dart stuff.
        </p>
        <p>
        <paper-button on-click='doSomething'>Do it!</paper-button>
        <paper-button on-click='doSomethingAsync'>Do it (async)!</paper-button>
        </p>
        <p>
        <paper-button on-click='startPeriodic'>Start Periodic</paper-button>
        <paper-button on-click='stopPeriodic'>Stop Periodic</paper-button>
       
        </p>
        <div class='console'>
        <dom-repeat items='[[messages]]' as='msg' mutable-data>
        <template>
            <p>[[index]] : [[msg]]</p>
            </template>
        </dom-repeat>
        </div>
        
        `;
    }

    log(s: string) {
        this.messages.insert(0,s);
        this.notifyPath('messages');
        console.log(s);
    }

    doSomething() {
        let s = new DartList.literal(1, 2, 3);
        s.expand((n) => new DartList.generate(n, (i) => new DartString(`Hello ${n}-${i}`))).forEach((n) => {
            this.log("Ciao " + n);
        });

    }

    async doSomethingAsync() {
        let f = new Future.delayed<string>(new DartDuration({ seconds: 4 }), () => {
            return new DartString.fromCharCodes(new DartIterable.generate(50, (i) => i + 65)).valueOf();
        });
        this.log(`result : ${await f}`);
    }

    createPeriodic() {
        if (this.stream == null) {
            this.stream = new DartStream.periodic<string>(new DartDuration({ seconds: 1 }), (count) => {
                return `Tick ${count}`;
            });

            this.stream = this.stream.asBroadcastStream();
        }
    }

    async startPeriodic() {
        this.createPeriodic();
        this.stop = false;
        this.log("Started");
        try {
            for await (let s of this.stream) {
                this.log(s);
                if (s == 'Tick 10') {
                    throw Error("When exception");
                }
                if (this.stop) {
                    break;
                }
            }
        } catch (e) {
            this.log("Interrupted because of exception :" + e);
        }
        this.log("Stopped");
    }

    stopPeriodic() {
        this.stop = true;
        this.stream = null;
    }
}
