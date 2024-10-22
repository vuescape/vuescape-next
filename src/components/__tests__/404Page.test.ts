// packages/vuescape-next/src/components/test_404Page.vue

import { shallowMount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import NotFoundPage from '../404Page.vue';
describe('404Page.vue', () => {
  it('renders "Page Not Found" message', () => {
    const wrapper = shallowMount(NotFoundPage);
    expect(wrapper.find('h3').text()).toBe('Page Not Found');
  });

  it('renders additional message correctly', () => {
    const wrapper = shallowMount(NotFoundPage);
    const message = "We're sorry, but the page you requested cannot be found. Please check the website address and try again or try navigating with the menu. Clicking the Logo at the top left will take you to the home page.";
    expect(wrapper.find('div').text()).toContain(message);
  });
});
