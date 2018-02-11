const { describe, it } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');
import harness from '@dojo/test-extras/harness';
import { v, w } from '@dojo/widget-core/d';

import ActionBar, { ActionBarButton } from '../../../src/widgets/ActionBar';
import * as actionbarCss from '../../../src/widgets/styles/actionbar.m.css';
import * as actionbarbuttonCss from '../../../src/widgets/styles/actionbarbutton.m.css';

describe('ActionBarButton', () => {
	it('should provide a basic render when provided with no properties', () => {
		const widget = harness(ActionBarButton);

		widget.expectRender(
			v(
				'li',
				{
					classes: [actionbarbuttonCss.root, actionbarbuttonCss.rootFixed],
					role: 'presentation',
					onclick: widget.listener
				},
				[
					v('a', {
						classes: [actionbarbuttonCss.label, actionbarbuttonCss.labelFixed, null],
						key: 'link',
						role: 'button',
						tabIndex: 0,
						title: undefined
					})
				]
			)
		);

		widget.destroy();
	});

	it('should call onClick when clicked', () => {
		const widget = harness(ActionBarButton);

		let clicked = 0;
		widget.setProperties({
			label: 'foo',
			onClick() {
				clicked++;
			}
		});

		assert.strictEqual(clicked, 0);
		widget.sendEvent('click', { key: 'link' });
		assert.strictEqual(clicked, 1);

		widget.destroy();
	});

	it('supports adding an icon class', () => {
		const widget = harness(ActionBarButton);
		widget.setProperties({
			iconClass: 'bar',
			label: 'foo'
		});

		widget.expectRender(
			v(
				'li',
				{
					classes: [actionbarbuttonCss.root, actionbarbuttonCss.rootFixed],
					role: 'presentation',
					onclick: widget.listener
				},
				[
					v('a', {
						classes: [actionbarbuttonCss.label, actionbarbuttonCss.labelFixed, 'bar'],
						key: 'link',
						role: 'button',
						tabIndex: 0,
						title: 'foo'
					})
				]
			)
		);

		widget.destroy();
	});

	it('supports adding an array of icon classes', () => {
		const widget = harness(ActionBarButton);
		widget.setProperties({
			iconClass: ['bar', 'baz'],
			label: 'foo'
		});

		widget.expectRender(
			v(
				'li',
				{
					classes: [actionbarbuttonCss.root, actionbarbuttonCss.rootFixed],
					role: 'presentation',
					onclick: widget.listener
				},
				[
					v('a', {
						classes: [actionbarbuttonCss.label, actionbarbuttonCss.labelFixed, 'bar', 'baz'],
						key: 'link',
						role: 'button',
						tabIndex: 0,
						title: 'foo'
					})
				]
			)
		);

		widget.destroy();
	});
});

describe('ActionBar', () => {
	it('should provide a basic render when provided with no properties', () => {
		const widget = harness(ActionBar);

		const expected = v(
			'div',
			{
				classes: [actionbarCss.root, actionbarCss.rootFixed],
				key: 'root'
			},
			[
				v(
					'ul',
					{
						'aria-label': undefined,
						classes: [actionbarCss.toolbar, actionbarCss.toolbarFixed],
						role: 'toolbar'
					},
					[]
				)
			]
		);

		widget.expectRender(expected);

		widget.destroy();
	});

	it('should properly render children', () => {
		const widget = harness(ActionBar);
		widget.setChildren([w(ActionBarButton, { label: 'foo' }), w(ActionBarButton, { label: 'bar' })]);

		const expected = v(
			'div',
			{
				classes: [actionbarCss.root, actionbarCss.rootFixed],
				key: 'root'
			},
			[
				v(
					'ul',
					{
						'aria-label': undefined,
						classes: [actionbarCss.toolbar, actionbarCss.toolbarFixed],
						role: 'toolbar'
					},
					[w(ActionBarButton, { label: 'foo' }), w(ActionBarButton, { label: 'bar' })]
				)
			]
		);

		widget.expectRender(expected);

		widget.destroy();
	});
});
