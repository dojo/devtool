const { describe, it } = intern.getInterface('bdd');
import harness, { Harness } from '@dojo/test-extras/harness';
import { v, w } from '@dojo/widget-core/d';
import { DNode } from '@dojo/widget-core/interfaces';

import DevTool, { DevToolProperties } from '../../../src/widgets/DevTool';
import * as devtoolCss from '../../../src/widgets/styles/devtool.m.css';
import * as icons from '../../../src/widgets/styles/icons.m.css';

import Button from '@dojo/widgets/button/Button';
import Tab from '@dojo/widgets/tabcontroller/Tab';
import TabController from '@dojo/widgets/tabcontroller/TabController';
import ActionBar, { ActionBarButton } from '../../../src/widgets/ActionBar';
import EventLog from '../../../src/widgets/EventLog';
import ItemList from '../../../src/widgets/ItemList';
import devToolTheme from '../../../src/themes/devtool/index';
import { Diagnostics, InterfaceState } from '../../../src/state/interfaces';
import { EventLogRecord } from '@dojo/diagnostics/diagnosticEvents';

function getMockState(
	api = false,
	view?: InterfaceState['view'],
	diagnostics: Diagnostics = {
		eventLog: [],
		projectors: [],
		lastRender: null,
		stores: []
	}
): DevToolProperties {
	return {
		diagnostics,
		interface: {
			apiVersion: api ? 'foo' : undefined,
			activeIndex: 0,
			expandedDNodes: [],
			expandedProperties: {},
			expandedStateNodes: [],
			view
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

function getLeftRender(
	widget: Harness<any>,
	title: string,
	select: DNode,
	viewDom: DNode,
	projectors: boolean = false,
	stores: boolean = false
) {
	return v('div', { classes: devtoolCss.left }, [
		v('div', { classes: devtoolCss.leftHeader }, [
			v('span', { classes: devtoolCss.leftTitle, key: 'title' }, [title]),
			select,
			w(ActionBar, { label: 'Actionbar Actions' }, [
				w(ActionBarButton, {
					iconClass: icons.logs,
					key: 'logs',
					label: 'Display Event Logs',
					onClick: widget.listener
				}),
				projectors
					? w(ActionBarButton, {
							iconClass: icons.render,
							key: 'lastRender',
							label: 'Display Last Render',
							onClick: widget.listener
						})
					: null,
				stores
					? w(ActionBarButton, {
							iconClass: icons.stores,
							key: 'store',
							label: 'Display Store State',
							onClick: widget.listener
						})
					: null,
				stores
					? w(ActionBarButton, {
							iconClass: icons.travel,
							key: 'travel',
							label: 'Time travel a store state',
							onClick: widget.listener
						})
					: null
			])
		]),
		viewDom
	]);
}

function getRightRender(
	widget: Harness<any>,
	items?: { [key: string]: string | number | boolean | undefined | null },
	activeIndex = 0,
	expanded?: string[]
) {
	return v('div', { classes: devtoolCss.right }, [
		w(TabController, { activeIndex, onRequestTabChange: widget.listener }, [
			items
				? w(
						Tab,
						{
							key: 'properties',
							label: 'Properties',
							// TODO: Remove when https://github.com/dojo/widgets/issues/400 resolved
							theme: devToolTheme
						},
						[
							w(ItemList, {
								expanded,
								getItemChildren: widget.listener as any,
								items,
								hasChildren: widget.listener,
								valueFormatter: widget.listener as any,

								onToggle: widget.listener
							})
						]
					)
				: null
		])
	]);
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

	it('should render a basic UI when API present', () => {
		const widget = harness(DevTool);
		widget.setProperties(getMockState(true));
		widget.expectRender(
			v('div', { classes: devtoolCss.root, key: 'root' }, [
				v('div', { classes: devtoolCss.content, key: 'content' }, [
					getLeftRender(widget, 'Dojo 2 Development Tool', null, null, true, true),
					getRightRender(widget)
				])
			])
		);
	});

	it('should render log view when view is "log"', () => {
		const widget = harness(DevTool);
		const eventLog: EventLogRecord[] = [];
		const diagnostics = {
			eventLog,
			projectors: [],
			lastRender: null,
			stores: []
		};
		widget.setProperties(getMockState(true, 'logs', diagnostics));
		const viewDom = w(EventLog, {
			key: 'eventLog',
			eventLog,
			selected: undefined,
			onSelect: widget.listener
		});
		widget.expectRender(
			v('div', { classes: devtoolCss.root, key: 'root' }, [
				v('div', { classes: devtoolCss.content, key: 'content' }, [
					getLeftRender(widget, 'Event Log', null, viewDom, true, true),
					getRightRender(widget)
				])
			])
		);
	});
});
