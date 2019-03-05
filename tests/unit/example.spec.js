import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import HelloWorld from '@/components/HelloWorld.vue';

describe('HelloWorld.vue', () => {
  it('renders props.msg when passed', () => {
    const title = 'Hello!';
    const wrapper = shallowMount(HelloWorld, {
      propsData: { title },
    });
    expect(wrapper.text()).to.include(title);
  });
});
