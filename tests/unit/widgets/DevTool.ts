const { describe, it } = intern.getInterface('bdd');
import harness from '@dojo/test-extras/harness';
import { v, w } from '@dojo/widget-core/d';

import DevTool, { DevToolProperties } from '../../../src/widgets/DevTool';
import * as devtoolCss from '../../../src/widgets/styles/devtool.m.css';

import Button from '@dojo/widgets/button/Button';

function getMockState(): DevToolProperties {
	return {
		diagnostics: {
			eventLog: [],
			projectors: [],
			lastRender: null,
			stores: []
		},
		interface: {
			activeIndex: 0,
			expandedDNodes: [],
			expandedProperties: {},
			expandedStateNodes: []
		},
		refreshDiagnostics(): any {
			return Promise.resolve();
		},
		setInterfaceProperty(key: string, value: any): any {
			return Promise.resolve();
		},
		toggleExpanded(key: string, id: string, value: string): any {
			return Promise.resolve();
		}
	};
}

describe('DevTool', () => {
	it('should render no diagnostics available by default', () => {
		const widget = harness(DevTool);
		widget.setProperties(getMockState());
		widget.expectRender(
			v(
				'div',
				{
					classes: devtoolCss.noapi,
					key: 'noapi'
				},
				[
					v('div', { classes: devtoolCss.banner }, ['No Dojo 2 diagnostics detected']),
					w(Button, { onClick: widget.listener }, ['Refresh'])
				]
			)
		);
	});
});
