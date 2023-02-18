import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component({
    name: 'PascalCaseComponent'
})
export default class PascalCaseComponent extends Vue {
    @Prop() prop1;
    @Prop() prop2;
}