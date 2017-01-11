<script>
import 'vendor/prism.css';
import Prism from "vendor/prism";
import {setToolDisplay, wrapIdSelector, wrapNameSelector} from "../utils";
import { mapState } from 'vuex';
import { mapActions } from 'vuex';
import { ADD_CODE_DATA, UPDATE_CODE_DATA} from 'store/code';

var MicroCode = (function(){
	return {
		init: function(inputSel, outputSel, languageSel){
			this.focusInput(inputSel);
			this.listenForInput(inputSel);
			this.listenForLanguage(languageSel, '.code-output', inputSel);
			this.renderOutput(outputSel, $(inputSel)[0].value);
			this.listenerForScroll(inputSel, outputSel);
		},
		
		listenForInput: function(inputSel){
			var self = this;

			$(inputSel).on('input keydown', function(key){
				var input = this,
					selStartPos = input.selectionStart,
					inputVal = input.value;

				if(key.keyCode === 9){
					input.value = inputVal.substring(0, selStartPos) + "    " + inputVal.substring(selStartPos, input.value.length);
					input.selectionStart = selStartPos + 4;
					input.selectionEnd = selStartPos + 4;
					key.preventDefault();
				}

				self.renderOutput('.code-output', this.value);
			});

			Prism.highlightAll();
		},
		
		listenForLanguage: function(languageSel, outputSel, inputSel){
			var self = this;
			$(languageSel).on('change', function(){
				$('code', outputSel)
					.removeClass()
					.addClass('language-' + this.value)
					.removeAttr('data-language');
				
				$(outputSel)
					.removeClass()
					.addClass('code-output language-' + this.value);
				
				$(inputSel)
					.val('');
				
				$('code', outputSel)
					.html('');
				
				self.focusInput(inputSel);
			});
		},
		
		listenerForScroll: function(inputSel, outputSel){
			$(inputSel).on('scroll', function(){
				console.log(this.scrollTop);
				$(outputSel)[0].scrollTop = this.scrollTop;
			});
		},
		
		renderOutput: function(outputSel, value){
			$('code', outputSel)
				.html(value.replace(/&/g, "&amp;").replace(/</g, "&lt;")
				.replace(/>/g, "&gt;") + "\n");
			
			Prism.highlightAll();
		},
		
		focusInput: function(inputSel){
			var input = $(inputSel);
			
			input.focus();
			
			input[0].selectionStart = input[0].value.length;
			input[0].selectionEnd = input[0].value.length;
		}
	}
})();

export default {
    data() {
        return {
            component: undefined,
            cleanEditor: false
        }
    },
    computed: mapState({
        data: function(state) {
            let result;

            for(let i in state.code.datasets) {
                if (state.code.datasets[i].id === state.code.filterKey) {
                    result = state.code.datasets[i];
                }
            }

            if (!result) {
                this.component = document.querySelector(wrapIdSelector(state.code.filterKey));
                result = {
                    id: this.component.id, 
                    name: this.component.querySelector(wrapNameSelector(this.tagName)).getAttribute('value'), 
                    code: ['//ID:',this.component.id, '\n', 'function() {}'].join(' ')
                };
                this[ADD_CODE_DATA](result);
            } else {
                this.component = result.id ? document.querySelector(wrapIdSelector(result.id)) : undefined;
            }
            
            return result;
        },
        boxName: state => state.tool.box.name,
        signName: state => state.tool.sign.name,
        tagName: state => state.tool.tag.name
    }),
    methods: {
        ...mapActions([ADD_CODE_DATA, UPDATE_CODE_DATA]),
        initCode() {
            this.cleanEditor = true;
            return this.data.code;
        },
        updataCode(value) {
            this[UPDATE_CODE_DATA]({id: this.data.id, code: value});
        },
        displayState() {
            if (this.component) {
                setToolDisplay(this.component, this.boxName, 'block');
                setToolDisplay(this.component, this.signName, 'block');
            }
        },
        hideState() {
            if (this.component) {
                setToolDisplay(this.component, this.boxName, 'none');
                setToolDisplay(this.component, this.signName, 'none');
            }
        }
    },
    mounted() {
        MicroCode.init('.code-input', '.code-output', '.language');
    },
    updated() {
        if (this.cleanEditor) {
           $(this.$el).find('.code-input').keydown();
        }
    }
};
</script>

<template>
    <main class="view" @mouseover="displayState" @mouseout="hideState">
        <h1 class="title"></h1>

        <div class="window">
            <div class="window-header">
                <div class="action-buttons"></div>
                <select class="language">
				<option value="JavaScript" selected>{{data.name}}</option>
			</select>
            </div>
            <div class="window-body">
                <textarea class="code-input" :value="initCode()" @input="updataCode($event.target.value)"></textarea>
                <pre class="code-output">
                    <code class="language-javascript"></code>
                </pre>
            </div>
        </div>
        <div class="credits">
            Enjoy yourself!
        </div>
    </main>>
</template>

<style scoped lang="less">
    @color-1st: LightCoral;
    @color-2nd: GhostWhite;
    @color-3rd: Gainsboro;
    *:focus {
        outline: none;
    }
    
    a {
        text-decoration: none;
        color: inherit;
    }
    
    main {
        height: 100%;
        weight: 100%;
        min-height: 100vh;
        display: flex;
        display: -webkit-flex;
        align-items: center;
        flex-direction: column;
    }
    
    .title {
        color: #fff;
        text-align: center;
        font-weight: 300;
        text-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
        font-size: 2.8em;
        margin-top: 1.0em;
        small {
            display: block;
            font-size: 0.6em;
            margin-top: 0.4em;
        }
    }
    
    .credits {
        color: #fff;
        text-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
        margin-top: 2em;
        font-size: 0.8em;
        opacity: 0.5;
    }
    
    .window {
        width: 90%;
        height: 90%;
        background: @color-2nd;
        border-radius: 0.3rem;
        box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        .window-header {
            height: 37px;
            background: @color-3rd;
            position: relative;
            .action-buttons {
                position: absolute;
                top: 50%;
                left: 10px;
                margin-top: -5px;
                width: 10px;
                height: 10px;
                background: Crimson;
                border-radius: 50%;
                box-shadow: 15px 0 0 Orange, 30px 0 0 LimeGreen;
            }
            .language {
                display: inline-block;
                position: absolute;
                right: 10px;
                top: 50%;
                margin-top: -10px;
                height: 21px;
                padding: 0 1em;
                text-align: right;
                appearance: none;
                border: none;
                background: transparent;
                font-family: Lato, sans-serif;
                color: DimGrey;
                &:before {
                    content: 'asd';
                }
                &:hover {
                    background: rgba(0, 0, 0, 0.1);
                }
            }
        }
        .window-body {
            position: relative;
            height: 90%;
            .code-input,
            .code-output {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                padding: 1rem;
                border: none;
                font-family: 'PT Mono', monospace;
                font-size: 0.8rem;
                background: transparent;
                white-space: pre-wrap;
                line-height: 1.5em;
                word-wrap: break-word;
            }
            .code-input {
                opacity: 0.7;
                margin: 0;
                color: #999;
                resize: none;
            }
            .code-output {
                pointer-events: none;
                z-index: 3;
                margin: 0;
                overflow-y: auto;
                code {
                    position: absolute;
                    top: 0;
                    left: 0;
                    margin: 0;
                    padding: 1rem;
                    display: block;
                    color: #666;
                    font-size: 0.8rem;
                    font-family: 'PT Mono', monospace;
                }
            }
        }
    }
</style>