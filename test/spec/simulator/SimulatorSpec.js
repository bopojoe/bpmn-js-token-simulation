import { expect } from 'chai';
import SimulatorModule from 'lib/simulator';

import {
  bootstrapModeler,
  getBpmnJS
} from 'test/TestHelper';


describe('simulator', function() {

  describe('scopes', function() {

    verify('sub-process', (simulator) => {

      // given
      const rootElement = element('Process_1');
      const subProcess = element('SUB');

      // when
      const rootScope_A = simulator.createScope(rootElement);
      const rootScope_B = simulator.createScope(rootElement);

      const childScope_A1 = simulator.createScope(subProcess, rootScope_A);
      const childScope_A2 = simulator.createScope(subProcess, rootScope_A);

      // then
      expect(
        simulator.findScope({ element: subProcess })
      ).to.equal(childScope_A1);

      expect(
        simulator.findScope({ parent: rootScope_A })
      ).to.equal(childScope_A1);

      expect(
        simulator.findScope({ parent: rootScope_B })
      ).not.to.exist;

      expect(
        simulator.findScope({ waitsOnElement: rootScope_A })
      ).not.to.exist;

      expect(
        simulator.findScope({ destroyed: true })
      ).not.to.exist;

      expect(
        simulator.findScope({ destroyed: false })
      ).to.equal(rootScope_A);

      // but when
      simulator.destroyScope(childScope_A1);

      // then
      expect(
        simulator.findScope({ destroyed: true })
      ).to.equal(childScope_A1);

      expect(
        simulator.findScope({ element: subProcess })
      ).to.equal(childScope_A2);

      expect(
        simulator.findScope({ parent: rootScope_A })
      ).to.equal(childScope_A2);
    });

  });


  describe('basic scenarios', function() {

    verify('simple', () => {

      // given
      signal({
        element: element('Process_1')
      });

      // then
      expectTrace([
        'createScope:Process_1:null',
        'signal:Process_1:1h9nnt7',
        'createScope:START:1h9nnt7',
        'signal:START:1g0b67t',
        'exit:START:1g0b67t',
        'createScope:Flow_2:1h9nnt7',
        'destroyScope:START:1g0b67t',
        'enter:Flow_2:1h9nnt7',
        'exit:Flow_2:0fcfa3x',
        'createScope:TASK:1h9nnt7',
        'destroyScope:Flow_2:0fcfa3x',
        'enter:TASK:1h9nnt7',
        'exit:TASK:1652tfj',
        'createScope:Flow_1:1h9nnt7',
        'destroyScope:TASK:1652tfj',
        'enter:Flow_1:1h9nnt7',
        'exit:Flow_1:1vu5u2u',
        'createScope:END:1h9nnt7',
        'destroyScope:Flow_1:1vu5u2u',
        'enter:END:1h9nnt7',
        'exit:END:13swzq0',
        'destroyScope:END:13swzq0',
        'exit:Process_1:1h9nnt7',
        'destroyScope:Process_1:1h9nnt7'
      ]);
    });


    verify('exclusive-gateway-fork-join', () => {

      // given
      setConfig(element('G_A'), {
        activeOutgoing: element('Flow_2')
      });

      // when
      signal({
        element: element('Process_1'),
        startEvent: element('START')
      });

      // then
      expectTrace([
        'createScope:Process_1:null',
        'signal:Process_1:1w3kmjk',
        'createScope:START:1w3kmjk',
        'signal:START:1hxahns',
        'exit:START:1hxahns',
        'createScope:Flow_1:1w3kmjk',
        'destroyScope:START:1hxahns',
        'enter:Flow_1:1w3kmjk',
        'exit:Flow_1:1tp37tz',
        'createScope:G_A:1w3kmjk',
        'destroyScope:Flow_1:1tp37tz',
        'enter:G_A:1w3kmjk',
        'exit:G_A:01tuc5y',
        'createScope:Flow_2:1w3kmjk',
        'destroyScope:G_A:01tuc5y',
        'enter:Flow_2:1w3kmjk',
        'exit:Flow_2:1vmoduu',
        'createScope:G_B:1w3kmjk',
        'destroyScope:Flow_2:1vmoduu',
        'enter:G_B:1w3kmjk',
        'exit:G_B:0xfgmi1',
        'createScope:Flow_4:1w3kmjk',
        'destroyScope:G_B:0xfgmi1',
        'enter:Flow_4:1w3kmjk',
        'exit:Flow_4:19jddme',
        'createScope:END:1w3kmjk',
        'destroyScope:Flow_4:19jddme',
        'enter:END:1w3kmjk',
        'exit:END:0ui1s69',
        'destroyScope:END:0ui1s69',
        'exit:Process_1:1w3kmjk',
        'destroyScope:Process_1:1w3kmjk'
      ]);
    });


    verify('exclusive-gateway-join', () => {

      // when
      signal({
        element: element('Process_1'),
        startEvent: element('START')
      });

      // then
      expectTrace([
        'createScope:Process_1:null',
        'signal:Process_1:0i7boji',
        'createScope:START:0i7boji',
        'signal:START:0hc8yzk',
        'exit:START:0hc8yzk',
        'createScope:Flow_2:0i7boji',
        'destroyScope:START:0hc8yzk',
        'enter:Flow_2:0i7boji',
        'exit:Flow_2:0107cam',
        'createScope:GATE:0i7boji',
        'destroyScope:Flow_2:0107cam',
        'enter:GATE:0i7boji',
        'exit:GATE:0v7hr6a',
        'createScope:Flow_1:0i7boji',
        'destroyScope:GATE:0v7hr6a',
        'enter:Flow_1:0i7boji',
        'exit:Flow_1:0ra8bk2',
        'createScope:END:0i7boji',
        'destroyScope:Flow_1:0ra8bk2',
        'enter:END:0i7boji',
        'exit:END:0rzjj3p',
        'destroyScope:END:0rzjj3p',
        'exit:Process_1:0i7boji',
        'destroyScope:Process_1:0i7boji'
      ]);
    });


    verify('task-join', () => {

      // when
      signal({
        element: element('Process_1'),
        startEvent: element('START')
      });

      // then
      expectTrace([
        'createScope:Process_1:null',
        'signal:Process_1:0ei7bnu',
        'createScope:START:0ei7bnu',
        'signal:START:1y4cd9g',
        'exit:START:1y4cd9g',
        'createScope:Flow_2:0ei7bnu',
        'createScope:Flow_4:0ei7bnu',
        'destroyScope:START:1y4cd9g',
        'enter:Flow_2:0ei7bnu',
        'enter:Flow_4:0ei7bnu',
        'exit:Flow_2:0j1kklc',
        'createScope:TASK:0ei7bnu',
        'destroyScope:Flow_2:0j1kklc',
        'exit:Flow_4:1pzh4kz',
        'createScope:TASK:0ei7bnu',
        'destroyScope:Flow_4:1pzh4kz',
        'enter:TASK:0ei7bnu',
        'enter:TASK:0ei7bnu',
        'exit:TASK:18b9idm',
        'createScope:Flow_3:0ei7bnu',
        'destroyScope:TASK:18b9idm',
        'exit:TASK:067njez',
        'createScope:Flow_3:0ei7bnu',
        'destroyScope:TASK:067njez',
        'enter:Flow_3:0ei7bnu',
        'enter:Flow_3:0ei7bnu',
        'exit:Flow_3:1h87iys',
        'createScope:END:0ei7bnu',
        'destroyScope:Flow_3:1h87iys',
        'exit:Flow_3:0jido76',
        'createScope:END:0ei7bnu',
        'destroyScope:Flow_3:0jido76',
        'enter:END:0ei7bnu',
        'enter:END:0ei7bnu',
        'exit:END:1fb2rqv',
        'destroyScope:END:1fb2rqv',
        'exit:END:1ih86mo',
        'destroyScope:END:1ih86mo',
        'exit:Process_1:0ei7bnu',
        'destroyScope:Process_1:0ei7bnu'
      ]);
    });


    verify('catch-event', () => {

      // when
      signal({
        element: element('Process_1'),
        startEvent: element('START')
      });

      // then
      expectTrace([
        'createScope:Process_1:null',
        'signal:Process_1:0pgqzcd',
        'createScope:START:0pgqzcd',
        'signal:START:02qoaab',
        'exit:START:02qoaab',
        'createScope:Flow_1:0pgqzcd',
        'destroyScope:START:02qoaab',
        'enter:Flow_1:0pgqzcd',
        'exit:Flow_1:1mtm8jo',
        'createScope:CATCH:0pgqzcd',
        'destroyScope:Flow_1:1mtm8jo',
        'enter:CATCH:0pgqzcd'
      ]);

      // but when
      const catchEvent = element('CATCH');

      signal({
        element: catchEvent,
        scope: findScope({
          element: catchEvent
        })
      });

      // then
      expectTrace([
        'signal:CATCH:1n9colu',
        'exit:CATCH:1n9colu',
        'createScope:Flow_2:0pgqzcd',
        'destroyScope:CATCH:1n9colu',
        'enter:Flow_2:0pgqzcd',
        'exit:Flow_2:18o9s7k',
        'createScope:END:0pgqzcd',
        'destroyScope:Flow_2:18o9s7k',
        'enter:END:0pgqzcd',
        'exit:END:1aa23s7',
        'destroyScope:END:1aa23s7',
        'exit:Process_1:0pgqzcd',
        'destroyScope:Process_1:0pgqzcd'
      ]);
    });


    verify('link-event', () => {

      // when
      signal({
        element: element('Process_1'),
        startEvent: element('START')
      });

      // then
      expectTrace([
        'createScope:Process_1:null',
        'signal:Process_1:0okaali',
        'createScope:START:0okaali',
        'signal:START:0p9ukwk',
        'exit:START:0p9ukwk',
        'createScope:Flow_1:0okaali',
        'destroyScope:START:0p9ukwk',
        'enter:Flow_1:0okaali',
        'exit:Flow_1:0pohwmn',
        'createScope:LINK_T:0okaali',
        'destroyScope:Flow_1:0pohwmn',
        'enter:LINK_T:0okaali',
        'createScope:LINK_C:0okaali',
        'enter:LINK_C:0okaali',
        'exit:LINK_T:05u8fo1',
        'destroyScope:LINK_T:05u8fo1',
        'exit:LINK_C:0zp9xr7',
        'createScope:Flow_2:0okaali',
        'destroyScope:LINK_C:0zp9xr7',
        'enter:Flow_2:0okaali',
        'exit:Flow_2:0w5r4bl',
        'createScope:END:0okaali',
        'destroyScope:Flow_2:0w5r4bl',
        'enter:END:0okaali',
        'exit:END:16w744i',
        'destroyScope:END:16w744i',
        'exit:Process_1:0okaali',
        'destroyScope:Process_1:0okaali'
      ]);

    });


    verify('data-objects', () => {

      // when
      signal({
        element: element('Process_1')
      });

      // then
      expectTrace([
        'createScope:Process_1:null',
        'signal:Process_1:15qsuro',
        'createScope:START:15qsuro',
        'signal:START:113bdv2',
        'exit:START:113bdv2',
        'createScope:Flow_1:15qsuro',
        'destroyScope:START:113bdv2',
        'enter:Flow_1:15qsuro',
        'exit:Flow_1:0cuhdzv',
        'createScope:TASK_A:15qsuro',
        'destroyScope:Flow_1:0cuhdzv',
        'enter:TASK_A:15qsuro',
        'exit:TASK_A:1xf8rr5',
        'createScope:Flow_2:15qsuro',
        'destroyScope:TASK_A:1xf8rr5',
        'enter:Flow_2:15qsuro',
        'exit:Flow_2:1wz5wbo',
        'createScope:TASK_B:15qsuro',
        'destroyScope:Flow_2:1wz5wbo',
        'enter:TASK_B:15qsuro',
        'exit:TASK_B:17ofnq5',
        'createScope:Flow_3:15qsuro',
        'destroyScope:TASK_B:17ofnq5',
        'enter:Flow_3:15qsuro',
        'exit:Flow_3:0sfb77v',
        'createScope:END:15qsuro',
        'destroyScope:Flow_3:0sfb77v',
        'enter:END:15qsuro',
        'exit:END:0k5k6py',
        'destroyScope:END:0k5k6py',
        'exit:Process_1:15qsuro',
        'destroyScope:Process_1:15qsuro'
      ]);
    });


    verify('event-based-gateway', () => {

      // given
      signal({
        element: element('Process_1')
      });

      // when
      signal({
        element: element('M_CATCH'),
        scope: findScope({
          element: element('G_EVENT')
        })
      });

      // then
      expectTrace([
        'createScope:Process_1:null',
        'signal:Process_1:10e86bk',
        'createScope:START:10e86bk',
        'signal:START:1k6c4wo',
        'exit:START:1k6c4wo',
        'createScope:Flow_1:10e86bk',
        'destroyScope:START:1k6c4wo',
        'enter:Flow_1:10e86bk',
        'exit:Flow_1:09e71v5',
        'createScope:G_EVENT:10e86bk',
        'destroyScope:Flow_1:09e71v5',
        'enter:G_EVENT:10e86bk',
        'signal:M_CATCH:1vtrr9g',
        'exit:M_CATCH:1vtrr9g',
        'createScope:Flow_4:10e86bk',
        'destroyScope:G_EVENT:1vtrr9g',
        'enter:Flow_4:10e86bk',
        'exit:Flow_4:0p36nzn',
        'createScope:END_A:10e86bk',
        'destroyScope:Flow_4:0p36nzn',
        'enter:END_A:10e86bk',
        'exit:END_A:11av813',
        'destroyScope:END_A:11av813',
        'exit:Process_1:10e86bk',
        'destroyScope:Process_1:10e86bk'
      ]);
    });

  });


  describe('explicit waitAtElement', function() {

    verify('simple', () => {

      // given
      const task = element('TASK');

      waitAtElement(task);

      // when
      signal({
        element: element('Process_1')
      });

      // then
      expectTrace([
        'createScope:Process_1:null',
        'signal:Process_1:0w70imz',
        'createScope:START:0w70imz',
        'signal:START:1mo8ftr',
        'exit:START:1mo8ftr',
        'createScope:Flow_2:0w70imz',
        'destroyScope:START:1mo8ftr',
        'enter:Flow_2:0w70imz',
        'exit:Flow_2:02ff4ym',
        'createScope:TASK:0w70imz',
        'destroyScope:Flow_2:02ff4ym',
        'enter:TASK:0w70imz'
      ]);

      // but when
      signal({
        element: task,
        scope: findScope({
          element: task
        })
      });

      // then
      expectTrace([
        'signal:TASK:07uy7vw',
        'exit:TASK:07uy7vw',
        'createScope:Flow_1:1h9ifl8',
        'destroyScope:TASK:07uy7vw',
        'enter:Flow_1:1h9ifl8',
        'exit:Flow_1:00vrnkn',
        'createScope:END:1h9ifl8',
        'destroyScope:Flow_1:00vrnkn',
        'enter:END:1h9ifl8',
        'exit:END:0ekvc6i',
        'destroyScope:END:0ekvc6i',
        'exit:Process_1:1h9ifl8',
        'destroyScope:Process_1:1h9ifl8'
      ]);
    });

  });


  describe('parallel gateway', function() {

    verify('parallel-gateway', () => {

      // when
      signal({
        element: element('Process_1')
      });

      // then
      expectTrace([
        'createScope:Process_1:null',
        'signal:Process_1:1863y4x',
        'createScope:START_S:1863y4x',
        'signal:START_S:06kgqgb',
        'exit:START_S:06kgqgb',
        'createScope:Flow_2:1863y4x',
        'destroyScope:START_S:06kgqgb',
        'enter:Flow_2:1863y4x',
        'exit:Flow_2:14gac13',
        'createScope:F_GATE:1863y4x',
        'destroyScope:Flow_2:14gac13',
        'enter:F_GATE:1863y4x',
        'exit:F_GATE:0g64u6n',
        'createScope:Flow_3:1863y4x',
        'createScope:Flow_4:1863y4x',
        'createScope:Flow_5:1863y4x',
        'destroyScope:F_GATE:0g64u6n',
        'enter:Flow_3:1863y4x',
        'enter:Flow_4:1863y4x',
        'enter:Flow_5:1863y4x',
        'exit:Flow_3:1a2feby',
        'createScope:J_GATE:1863y4x',
        'destroyScope:Flow_3:1a2feby',
        'exit:Flow_4:18o1dd2',
        'createScope:J_GATE:1863y4x',
        'destroyScope:Flow_4:18o1dd2',
        'exit:Flow_5:1iikp0l',
        'createScope:J_GATE:1863y4x',
        'destroyScope:Flow_5:1iikp0l',
        'enter:J_GATE:1863y4x',
        'destroyScope:J_GATE:0r98p50',
        'destroyScope:J_GATE:161dmoi',
        'exit:J_GATE:0mc6bsm',
        'createScope:Flow_1:1863y4x',
        'destroyScope:J_GATE:0mc6bsm',
        'enter:Flow_1:1863y4x',
        'exit:Flow_1:0g4tjxq',
        'createScope:END_S:1863y4x',
        'destroyScope:Flow_1:0g4tjxq',
        'enter:END_S:1863y4x',
        'exit:END_S:0j4xzj4',
        'destroyScope:END_S:0j4xzj4',
        'exit:Process_1:1863y4x',
        'destroyScope:Process_1:1863y4x'
      ]);
    });


    verify('parallel-gateway-stuck', () => {

      // when
      signal({
        element: element('Process_1')
      });

      // then
      expectTrace([
        'createScope:Process_1:null',
        'signal:Process_1:1g3ti83',
        'createScope:START:1g3ti83',
        'signal:START:1qopt3k',
        'exit:START:1qopt3k',
        'createScope:Flow_2:1g3ti83',
        'destroyScope:START:1qopt3k',
        'enter:Flow_2:1g3ti83',
        'exit:Flow_2:0m7s1dn',
        'createScope:GATE:1g3ti83',
        'destroyScope:Flow_2:0m7s1dn',
        'enter:GATE:1g3ti83'
      ]);
    });

  });


  describe('end event', function() {

    verify('end-event', () => {

      // when
      signal({
        element: element('Process_1')
      });

      // then
      expectTrace([
        'createScope:Process_1:null',
        'signal:Process_1:0x7vlx9',
        'createScope:START:0x7vlx9',
        'signal:START:09t9ax8',
        'exit:START:09t9ax8',
        'createScope:Flow_1:0x7vlx9',
        'createScope:Flow_2:0x7vlx9',
        'destroyScope:START:09t9ax8',
        'enter:Flow_1:0x7vlx9',
        'enter:Flow_2:0x7vlx9',
        'exit:Flow_1:06zq377',
        'createScope:END:0x7vlx9',
        'destroyScope:Flow_1:06zq377',
        'exit:Flow_2:0s15kci',
        'createScope:END:0x7vlx9',
        'destroyScope:Flow_2:0s15kci',
        'enter:END:0x7vlx9',
        'enter:END:0x7vlx9',
        'exit:END:1cywlji',
        'destroyScope:END:1cywlji',
        'exit:END:1iwe8sc',
        'destroyScope:END:1iwe8sc',
        'exit:Process_1:0x7vlx9',
        'destroyScope:Process_1:0x7vlx9'
      ]);
    });


    verify('end-event-terminate', () => {

      // when
      signal({
        element: element('Process_1')
      });

      // then
      expectTrace([
        'createScope:Process_1:null',
        'signal:Process_1:0mnewbw',
        'createScope:START:0mnewbw',
        'signal:START:0ewz8qx',
        'exit:START:0ewz8qx',
        'createScope:Flow_1:0mnewbw',
        'createScope:Flow_2:0mnewbw',
        'destroyScope:START:0ewz8qx',
        'enter:Flow_1:0mnewbw',
        'enter:Flow_2:0mnewbw',
        'exit:Flow_1:08j79m9',
        'createScope:TASK:0mnewbw',
        'destroyScope:Flow_1:08j79m9',
        'exit:Flow_2:1o8p443',
        'createScope:T_END:0mnewbw',
        'destroyScope:Flow_2:1o8p443',
        'enter:TASK:0mnewbw',
        'enter:T_END:0mnewbw',
        'exit:T_END:1x6vhvt',
        'destroyScope:T_END:1x6vhvt',
        'exit:Process_1:0mnewbw',
        'destroyScope:TASK:0lyuevu',
        'destroyScope:Process_1:0mnewbw'
      ]);
    });


    verify('end-event-terminate-nested-scopes', () => {

      // when
      signal({
        element: element('Process_1')
      });

      // then
      expectTrace([
        'createScope:Process_1:null',
        'signal:Process_1:01wsf6r',
        'createScope:START:01wsf6r',
        'signal:START:0piid6i',
        'exit:START:0piid6i',
        'createScope:Flow_4:01wsf6r',
        'createScope:Flow_6:01wsf6r',
        'destroyScope:START:0piid6i',
        'enter:Flow_4:01wsf6r',
        'enter:Flow_6:01wsf6r',
        'exit:Flow_4:0p0uqng',
        'createScope:SUB:01wsf6r',
        'destroyScope:Flow_4:0p0uqng',
        'exit:Flow_6:17hikvi',
        'createScope:END_TERM:01wsf6r',
        'destroyScope:Flow_6:17hikvi',
        'enter:SUB:01wsf6r',
        'createScope:START_SUB:1vnft8u',
        'enter:END_TERM:01wsf6r',
        'signal:START_SUB:0a84qwx',
        'exit:END_TERM:0n7h7ps',
        'destroyScope:END_TERM:0n7h7ps',
        'exit:START_SUB:0a84qwx',
        'createScope:Flow_3:1vnft8u',
        'destroyScope:START_SUB:0a84qwx',
        'exit:Process_1:01wsf6r',
        'destroyScope:Flow_3:198x63g',
        'destroyScope:SUB:1vnft8u',
        'destroyScope:Process_1:01wsf6r'
      ]);
    });

  });


  describe('sub-process', function() {

    verify('sub-process', () => {

      // when
      signal({
        element: element('Process_1')
      });

      // then
      expectTrace([
        'createScope:Process_1:null',
        'signal:Process_1:0hvyhts',
        'createScope:START:0hvyhts',
        'signal:START:1k80fd1',
        'exit:START:1k80fd1',
        'createScope:Flow_2:0hvyhts',
        'destroyScope:START:1k80fd1',
        'enter:Flow_2:0hvyhts',
        'exit:Flow_2:1xt9ux4',
        'createScope:SUB:0hvyhts',
        'destroyScope:Flow_2:1xt9ux4',
        'enter:SUB:0hvyhts',
        'createScope:START_SUB:0volx4b',
        'signal:START_SUB:1mcxzu5',
        'exit:START_SUB:1mcxzu5',
        'createScope:Flow_4:0volx4b',
        'destroyScope:START_SUB:1mcxzu5',
        'enter:Flow_4:0volx4b',
        'exit:Flow_4:1fcdi6e',
        'createScope:TASK_SUB:0volx4b',
        'destroyScope:Flow_4:1fcdi6e',
        'enter:TASK_SUB:0volx4b',
        'exit:TASK_SUB:02p1o6a',
        'createScope:Flow_1:0volx4b',
        'destroyScope:TASK_SUB:02p1o6a',
        'enter:Flow_1:0volx4b',
        'exit:Flow_1:19bhhxr',
        'createScope:END_SUB:0volx4b',
        'destroyScope:Flow_1:19bhhxr',
        'enter:END_SUB:0volx4b',
        'exit:END_SUB:03d2yc3',
        'destroyScope:END_SUB:03d2yc3',
        'exit:SUB:0volx4b',
        'createScope:Flow_3:0hvyhts',
        'destroyScope:SUB:0volx4b',
        'enter:Flow_3:0hvyhts',
        'exit:Flow_3:0mz1k64',
        'createScope:END:0hvyhts',
        'destroyScope:Flow_3:0mz1k64',
        'enter:END:0hvyhts',
        'exit:END:182oiye',
        'destroyScope:END:182oiye',
        'exit:Process_1:0hvyhts',
        'destroyScope:Process_1:0hvyhts'
      ]);

    });

  });


  describe('event sub-process', function() {

    verify('event-sub-process-interrupting', () => {

      // given
      const processElement = element('Process_1');

      signal({
        element: processElement
      });

      // when
      const eventSub = element('EVENT_SUB');

      signal({
        element: eventSub,
        parentScope: findScope({
          element: processElement
        })
      });

      // then
      expectTrace([
        'createScope:Process_1:null',
        'signal:Process_1:0iaq7m8',
        'createScope:START:0iaq7m8',
        'signal:START:1d2f16b',
        'exit:START:1d2f16b',
        'createScope:Flow_5:0iaq7m8',
        'destroyScope:START:1d2f16b',
        'enter:Flow_5:0iaq7m8',
        'exit:Flow_5:1jd1q1a',
        'createScope:S:0iaq7m8',
        'destroyScope:Flow_5:1jd1q1a',
        'enter:S:0iaq7m8',
        'createScope:START_S:1j2o4uc',
        'signal:START_S:151tyg4',
        'exit:START_S:151tyg4',
        'createScope:Flow_6:1j2o4uc',
        'destroyScope:START_S:151tyg4',
        'enter:Flow_6:1j2o4uc',
        'exit:Flow_6:0e33jt3',
        'createScope:RECEIVE:1j2o4uc',
        'destroyScope:Flow_6:0e33jt3',
        'enter:RECEIVE:1j2o4uc',
        'createScope:EVENT_SUB:0iaq7m8',
        'signal:EVENT_SUB:0q5sck6',
        'createScope:START_SUB:0q5sck6',
        'signal:START_SUB:1l6zh86',
        'destroyScope:RECEIVE:0e9iqg6',
        'destroyScope:S:1j2o4uc',
        'exit:START_SUB:1l6zh86',
        'createScope:Flow_3:0q5sck6',
        'destroyScope:START_SUB:1l6zh86',
        'enter:Flow_3:0q5sck6',
        'exit:Flow_3:0335ggq',
        'createScope:END_SUB:0q5sck6',
        'destroyScope:Flow_3:0335ggq',
        'enter:END_SUB:0q5sck6',
        'exit:END_SUB:192adoz',
        'destroyScope:END_SUB:192adoz',
        'exit:EVENT_SUB:0q5sck6',
        'destroyScope:EVENT_SUB:0q5sck6',
        'exit:Process_1:0iaq7m8',
        'destroyScope:Process_1:0iaq7m8'
      ]);

    });


    verify('event-sub-process-non-interrupting', () => {

      // given
      const processElement = element('Process_1');

      signal({
        element: processElement
      });

      // when
      const eventSub = element('EVENT_SUB');

      signal({
        element: eventSub,
        parentScope: findScope({
          element: processElement
        })
      });

      // then
      expectTrace([
        'createScope:Process_1:null',
        'signal:Process_1:150p3bn',
        'createScope:START:150p3bn',
        'signal:START:10b61uu',
        'exit:START:10b61uu',
        'createScope:Flow_1:150p3bn',
        'destroyScope:START:10b61uu',
        'enter:Flow_1:150p3bn',
        'exit:Flow_1:0qk04ef',
        'createScope:RECEIVE:150p3bn',
        'destroyScope:Flow_1:0qk04ef',
        'enter:RECEIVE:150p3bn',
        'createScope:EVENT_SUB:150p3bn',
        'signal:EVENT_SUB:081v4vo',
        'createScope:START_SUB:081v4vo',
        'signal:START_SUB:0gvao8e',
        'exit:START_SUB:0gvao8e',
        'createScope:Flow_3:081v4vo',
        'destroyScope:START_SUB:0gvao8e',
        'enter:Flow_3:081v4vo',
        'exit:Flow_3:0zzkq7u',
        'createScope:END_SUB:081v4vo',
        'destroyScope:Flow_3:0zzkq7u',
        'enter:END_SUB:081v4vo',
        'exit:END_SUB:0sr0aqp',
        'destroyScope:END_SUB:0sr0aqp',
        'exit:EVENT_SUB:081v4vo',
        'destroyScope:EVENT_SUB:081v4vo'
      ]);

    });

  });


  describe('boundary events', function() {

    verify('boundary-interrupting-sub-process', () => {

      // given
      const processElement = element('Process_1');

      signal({
        element: processElement
      });

      // when
      const interruptingBoundary = element('B_RUPTING');

      signal({
        element: interruptingBoundary,
        parentScope: findScope({
          element: processElement
        })
      });

      // then
      expectTrace([
        'createScope:Process_1:null',
        'signal:Process_1:0xqzwoz',
        'createScope:START:0xqzwoz',
        'signal:START:1jwuzeq',
        'exit:START:1jwuzeq',
        'createScope:Flow_4:0xqzwoz',
        'destroyScope:START:1jwuzeq',
        'enter:Flow_4:0xqzwoz',
        'exit:Flow_4:1tztt90',
        'createScope:SUB:0xqzwoz',
        'destroyScope:Flow_4:1tztt90',
        'enter:SUB:0xqzwoz',
        'createScope:START_SUB:1h9xzcr',
        'signal:START_SUB:0g4v30m',
        'exit:START_SUB:0g4v30m',
        'createScope:Flow_3:1h9xzcr',
        'destroyScope:START_SUB:0g4v30m',
        'enter:Flow_3:1h9xzcr',
        'exit:Flow_3:1v6ta2p',
        'createScope:CATCH_SUB:1h9xzcr',
        'destroyScope:Flow_3:1v6ta2p',
        'enter:CATCH_SUB:1h9xzcr',
        'createScope:B_RUPTING:0xqzwoz',
        'signal:B_RUPTING:1557188',
        'destroyScope:CATCH_SUB:05itneo',
        'exit:SUB:1h9xzcr',
        'destroyScope:SUB:1h9xzcr',
        'exit:B_RUPTING:1557188',
        'createScope:Flow_6:0xqzwoz',
        'destroyScope:B_RUPTING:1557188',
        'enter:Flow_6:0xqzwoz',
        'exit:Flow_6:1r4fvxk',
        'createScope:END_B:0xqzwoz',
        'destroyScope:Flow_6:1r4fvxk',
        'enter:END_B:0xqzwoz',
        'exit:END_B:01hf7h2',
        'destroyScope:END_B:01hf7h2',
        'exit:Process_1:0xqzwoz',
        'destroyScope:Process_1:0xqzwoz'
      ]);
    });


    verify('boundary-non-interrupting-sub-process', () => {

      // given
      const processElement = element('Process_1');

      signal({
        element: processElement
      });

      // when
      const nonInterruptingBoundary = element('B_NRUPTING');

      signal({
        element: nonInterruptingBoundary,
        parentScope: findScope({
          element: processElement
        })
      });

      // then
      expectTrace([
        'createScope:Process_1:null',
        'signal:Process_1:1spzl29',
        'createScope:START:1spzl29',
        'signal:START:0a39zp6',
        'exit:START:0a39zp6',
        'createScope:Flow_4:1spzl29',
        'destroyScope:START:0a39zp6',
        'enter:Flow_4:1spzl29',
        'exit:Flow_4:0m9g5ux',
        'createScope:SUB:1spzl29',
        'destroyScope:Flow_4:0m9g5ux',
        'enter:SUB:1spzl29',
        'createScope:START_SUB:0lnog18',
        'signal:START_SUB:1nrcnk4',
        'exit:START_SUB:1nrcnk4',
        'createScope:Flow_3:0lnog18',
        'destroyScope:START_SUB:1nrcnk4',
        'enter:Flow_3:0lnog18',
        'exit:Flow_3:0l89edx',
        'createScope:CATCH_SUB:0lnog18',
        'destroyScope:Flow_3:0l89edx',
        'enter:CATCH_SUB:0lnog18',
        'createScope:B_NRUPTING:1spzl29',
        'signal:B_NRUPTING:0zb84h5',
        'exit:B_NRUPTING:0zb84h5',
        'createScope:Flow_6:1spzl29',
        'destroyScope:B_NRUPTING:0zb84h5',
        'enter:Flow_6:1spzl29',
        'exit:Flow_6:0e8fxgy',
        'createScope:END_B:1spzl29',
        'destroyScope:Flow_6:0e8fxgy',
        'enter:END_B:1spzl29',
        'exit:END_B:0cws1tg',
        'destroyScope:END_B:0cws1tg'
      ]);
    });


    verify('boundary-interrupting-task', () => {

      // given
      const processElement = element('Process_1');

      signal({
        element: processElement
      });

      // when
      signal({
        element: element('B_RUPTING'),
        parentScope: findScope({
          element: processElement
        })
      });

      // then
      expectTrace([
        'createScope:Process_1:null',
        'signal:Process_1:0a2rwuy',
        'createScope:START:0a2rwuy',
        'signal:START:1xou9su',
        'exit:START:1xou9su',
        'createScope:Flow_1:0a2rwuy',
        'destroyScope:START:1xou9su',
        'enter:Flow_1:0a2rwuy',
        'exit:Flow_1:0i2fz8u',
        'createScope:RECEIVE:0a2rwuy',
        'destroyScope:Flow_1:0i2fz8u',
        'enter:RECEIVE:0a2rwuy',
        'createScope:B_RUPTING:0a2rwuy',
        'signal:B_RUPTING:1ctyb5z',
        'exit:RECEIVE:1v9w1b1',
        'destroyScope:RECEIVE:1v9w1b1',
        'exit:B_RUPTING:1ctyb5z',
        'createScope:Flow_2:0a2rwuy',
        'destroyScope:B_RUPTING:1ctyb5z',
        'enter:Flow_2:0a2rwuy',
        'exit:Flow_2:16qa7pb',
        'createScope:END_B:0a2rwuy',
        'destroyScope:Flow_2:16qa7pb',
        'enter:END_B:0a2rwuy',
        'exit:END_B:0tjmujt',
        'destroyScope:END_B:0tjmujt',
        'exit:Process_1:0a2rwuy',
        'destroyScope:Process_1:0a2rwuy'
      ]);
    });


    verify('boundary-non-interrupting-task', () => {

      // given
      signal({
        element: element('Process_1')
      });

      // when
      const nonInterruptingBoundary = element('B_NRUPTING');

      signal({
        element: nonInterruptingBoundary,
        parentScope: findScope({
          element: nonInterruptingBoundary.parent
        })
      });

      // then
      expectTrace([
        'createScope:Process_1:null',
        'signal:Process_1:0uianl7',
        'createScope:START:0uianl7',
        'signal:START:1bu54qn',
        'exit:START:1bu54qn',
        'createScope:Flow_1:0uianl7',
        'destroyScope:START:1bu54qn',
        'enter:Flow_1:0uianl7',
        'exit:Flow_1:1hzow82',
        'createScope:RECEIVE:0uianl7',
        'destroyScope:Flow_1:1hzow82',
        'enter:RECEIVE:0uianl7',
        'createScope:B_NRUPTING:0uianl7',
        'signal:B_NRUPTING:0fu2ym5',
        'exit:B_NRUPTING:0fu2ym5',
        'createScope:Flow_2:0uianl7',
        'destroyScope:B_NRUPTING:0fu2ym5',
        'enter:Flow_2:0uianl7',
        'exit:Flow_2:02cneh9',
        'createScope:END_B:0uianl7',
        'destroyScope:Flow_2:02cneh9',
        'enter:END_B:0uianl7',
        'exit:END_B:18wmzlx',
        'destroyScope:END_B:18wmzlx'
      ]);
    });

  });


  describe('message flows', function() {

    verify('message-flow-end-event-trigger-flow', () => {

      // when
      signal({
        element: element('PART_EXP')
      });

      // then
      expectTrace([
        'createScope:PART_EXP:null',
        'signal:PART_EXP:07zsrvi',
        'createScope:START:07zsrvi',
        'signal:START:1fhin7l',
        'exit:START:1fhin7l',
        'createScope:Flow_1:07zsrvi',
        'destroyScope:START:1fhin7l',
        'enter:Flow_1:07zsrvi',
        'exit:Flow_1:0v5crgd',
        'createScope:END:07zsrvi',
        'destroyScope:Flow_1:0v5crgd',
        'enter:END:07zsrvi',
        'createScope:M_FLOW:null',
        'signal:M_FLOW:0ve57yw',
        'exit:END:19ngjeg',
        'destroyScope:END:19ngjeg',
        'exit:M_FLOW:0ve57yw',
        'destroyScope:M_FLOW:0ve57yw',
        'exit:PART_EXP:07zsrvi',
        'destroyScope:PART_EXP:07zsrvi'
      ]);
    });


    verify('message-flow-pool-pool', () => {

      // when
      signal({
        element: element('M_FLOW')
      });

      // then
      expectTrace([
        'createScope:M_FLOW:null',
        'signal:M_FLOW:0z7uhdk',
        'exit:M_FLOW:0z7uhdk',
        'destroyScope:M_FLOW:0z7uhdk'
      ]);
    });


    verify('message-flow-task-trigger-flow', () => {

      // when
      signal({
        element: element('PART_EXP')
      });

      // then
      expectTrace([
        'createScope:PART_EXP:null',
        'signal:PART_EXP:04du1r4',
        'createScope:START:04du1r4',
        'signal:START:1sisnmg',
        'exit:START:1sisnmg',
        'createScope:Flow_1:04du1r4',
        'destroyScope:START:1sisnmg',
        'enter:Flow_1:04du1r4',
        'exit:Flow_1:1e8lk4y',
        'createScope:TASK:04du1r4',
        'destroyScope:Flow_1:1e8lk4y',
        'enter:TASK:04du1r4',
        'createScope:M_FLOW:null',
        'signal:M_FLOW:1kfx0ye',
        'exit:TASK:090szj2',
        'createScope:Flow_2:04du1r4',
        'destroyScope:TASK:090szj2',
        'exit:M_FLOW:1kfx0ye',
        'destroyScope:M_FLOW:1kfx0ye',
        'enter:Flow_2:04du1r4',
        'exit:Flow_2:1xfxds0',
        'createScope:END:04du1r4',
        'destroyScope:Flow_2:1xfxds0',
        'enter:END:04du1r4',
        'exit:END:1ou8tra',
        'destroyScope:END:1ou8tra',
        'exit:PART_EXP:04du1r4',
        'destroyScope:PART_EXP:04du1r4'
      ]);
    });


    verify('message-flow-trigger-receive-task', () => {

      // given
      signal({
        element: element('PART_EXP')
      });

      // when
      signal({
        element: element('M_FLOW')
      });

      // then
      expectTrace([
        'createScope:PART_EXP:null',
        'signal:PART_EXP:1c9w3nr',
        'createScope:START:1c9w3nr',
        'signal:START:04x4d82',
        'exit:START:04x4d82',
        'createScope:Flow_1:1c9w3nr',
        'destroyScope:START:04x4d82',
        'enter:Flow_1:1c9w3nr',
        'exit:Flow_1:1cnbnud',
        'createScope:R_TASK:1c9w3nr',
        'destroyScope:Flow_1:1cnbnud',
        'enter:R_TASK:1c9w3nr',
        'createScope:M_FLOW:null',
        'signal:M_FLOW:096d7lv',
        'exit:M_FLOW:096d7lv',
        'destroyScope:M_FLOW:096d7lv',
        'signal:R_TASK:1qvav3g',
        'exit:R_TASK:1qvav3g',
        'createScope:Flow_2:1c9w3nr',
        'destroyScope:R_TASK:1qvav3g',
        'enter:Flow_2:1c9w3nr',
        'exit:Flow_2:02d5of5',
        'createScope:END:1c9w3nr',
        'destroyScope:Flow_2:02d5of5',
        'enter:END:1c9w3nr',
        'exit:END:18huuhx',
        'destroyScope:END:18huuhx',
        'exit:PART_EXP:1c9w3nr',
        'destroyScope:PART_EXP:1c9w3nr'
      ]);
    });


    verify('message-flow-trigger-start-event', () => {

      // when
      signal({
        element: element('M_FLOW')
      });

      // then
      expectTrace([
        'createScope:M_FLOW:null',
        'signal:M_FLOW:0xhsq77',
        'exit:M_FLOW:0xhsq77',
        'createScope:PART_EXP:null',
        'destroyScope:M_FLOW:0xhsq77',
        'signal:PART_EXP:0k46v72',
        'createScope:START:0k46v72',
        'signal:START:047785r',
        'exit:START:047785r',
        'createScope:Flow_1:0k46v72',
        'destroyScope:START:047785r',
        'enter:Flow_1:0k46v72',
        'exit:Flow_1:1847vhq',
        'createScope:END:0k46v72',
        'destroyScope:Flow_1:1847vhq',
        'enter:END:0k46v72',
        'exit:END:0fxdemj',
        'destroyScope:END:0fxdemj',
        'exit:PART_EXP:0k46v72',
        'destroyScope:PART_EXP:0k46v72'
      ]);
    });


    verify('message-flow-throw-catch-events', () => {

      // when
      signal({
        element: element('PART_A')
      });

      // then
      expectTrace([
        'createScope:PART_A:null',
        'signal:PART_A:08v5y2h',
        'createScope:START:08v5y2h',
        'signal:START:0ojqmfu',
        'exit:START:0ojqmfu',
        'createScope:Flow_2:08v5y2h',
        'destroyScope:START:0ojqmfu',
        'enter:Flow_2:08v5y2h',
        'exit:Flow_2:0sqidhh',
        'createScope:THROW_M:08v5y2h',
        'destroyScope:Flow_2:0sqidhh',
        'enter:THROW_M:08v5y2h',
        'createScope:M_FLOW_A:null',
        'signal:M_FLOW_A:0uz2498',
        'exit:THROW_M:17m3ehw',
        'createScope:Flow_7:08v5y2h',
        'destroyScope:THROW_M:17m3ehw',
        'exit:M_FLOW_A:0uz2498',
        'createScope:PART_B:null',
        'destroyScope:M_FLOW_A:0uz2498',
        'enter:Flow_7:08v5y2h',
        'signal:PART_B:17w20y6',
        'createScope:START_B:17w20y6',
        'exit:Flow_7:03sspwq',
        'createScope:CATCH_M:08v5y2h',
        'destroyScope:Flow_7:03sspwq',
        'signal:START_B:1o5r87i',
        'enter:CATCH_M:08v5y2h',
        'exit:START_B:1o5r87i',
        'createScope:Flow_3:17w20y6',
        'destroyScope:START_B:1o5r87i',
        'enter:Flow_3:17w20y6',
        'exit:Flow_3:01sw2v9',
        'createScope:END_B:17w20y6',
        'destroyScope:Flow_3:01sw2v9',
        'enter:END_B:17w20y6',
        'createScope:M_FLOW_B:null',
        'signal:M_FLOW_B:1ma3b30',
        'exit:END_B:0mwwucq',
        'destroyScope:END_B:0mwwucq',
        'exit:M_FLOW_B:1ma3b30',
        'destroyScope:M_FLOW_B:1ma3b30',
        'exit:PART_B:17w20y6',
        'destroyScope:PART_B:17w20y6',
        'signal:CATCH_M:02fqdk8',
        'exit:CATCH_M:02fqdk8',
        'createScope:Flow_4:08v5y2h',
        'destroyScope:CATCH_M:02fqdk8',
        'enter:Flow_4:08v5y2h',
        'exit:Flow_4:1ep2dy6',
        'createScope:END:08v5y2h',
        'destroyScope:Flow_4:1ep2dy6',
        'enter:END:08v5y2h',
        'exit:END:1mva4zu',
        'destroyScope:END:1mva4zu',
        'exit:PART_A:08v5y2h',
        'destroyScope:PART_A:08v5y2h'
      ]);
    });


    verify('message-flow-dependent-processes', () => {

      // when
      signal({
        element: element('PART_A')
      });

      // then
      expectTrace([
        'createScope:PART_A:null',
        'signal:PART_A:0nv9f99',
        'createScope:START:0nv9f99',
        'signal:START:0tbs7pj',
        'exit:START:0tbs7pj',
        'createScope:Flow_2:0nv9f99',
        'destroyScope:START:0tbs7pj',
        'enter:Flow_2:0nv9f99',
        'exit:Flow_2:1jjhie9',
        'createScope:TASK_S:0nv9f99',
        'destroyScope:Flow_2:1jjhie9',
        'enter:TASK_S:0nv9f99',
        'createScope:M_FLOW_A:null',
        'signal:M_FLOW_A:14wfime',
        'exit:TASK_S:1ia5olg',
        'createScope:Flow_1:0nv9f99',
        'destroyScope:TASK_S:1ia5olg',
        'exit:M_FLOW_A:14wfime',
        'createScope:PART_B:null',
        'destroyScope:M_FLOW_A:14wfime',
        'enter:Flow_1:0nv9f99',
        'signal:PART_B:0aog30j',
        'createScope:START_B:0aog30j',
        'exit:Flow_1:0ix4mix',
        'createScope:TASK_R:0nv9f99',
        'destroyScope:Flow_1:0ix4mix',
        'signal:START_B:0zan2hu',
        'enter:TASK_R:0nv9f99',
        'exit:START_B:0zan2hu',
        'createScope:Flow_3:0aog30j',
        'destroyScope:START_B:0zan2hu',
        'enter:Flow_3:0aog30j',
        'exit:Flow_3:09k6ev6',
        'createScope:END_B:0aog30j',
        'destroyScope:Flow_3:09k6ev6',
        'enter:END_B:0aog30j',
        'createScope:M_FLOW_B:null',
        'signal:M_FLOW_B:1xv1oaj',
        'exit:END_B:1841u6v',
        'destroyScope:END_B:1841u6v',
        'exit:M_FLOW_B:1xv1oaj',
        'destroyScope:M_FLOW_B:1xv1oaj',
        'exit:PART_B:0aog30j',
        'destroyScope:PART_B:0aog30j',
        'signal:TASK_R:1iamo65',
        'exit:TASK_R:1iamo65',
        'createScope:Flow_4:0nv9f99',
        'destroyScope:TASK_R:1iamo65',
        'enter:Flow_4:0nv9f99',
        'exit:Flow_4:1dydpwz',
        'createScope:END:0nv9f99',
        'destroyScope:Flow_4:1dydpwz',
        'enter:END:0nv9f99',
        'exit:END:094oey2',
        'destroyScope:END:094oey2',
        'exit:PART_A:0nv9f99',
        'destroyScope:PART_A:0nv9f99'
      ]);
    });

  });

});


function verify(name, test, iit=it) {

  const diagram = require(`./Simulator.${name}.bpmn`);

  iit(name, async function() {

    let { err, warnings } = await bootstrapModeler(diagram, {
      additionalModules: [
        SimulatorModule,
        {
          __init__: [
            function(simulator, simulationTrace) {
              simulator.on('trace', function(event) {
                simulationTrace.push(event);
              });
            }
          ],
          simulationScopes: [ 'value', {} ],
          simulationTrace: [ 'value', [] ]
        }
      ]
    }).call(this);

    if (err) {
      return Promise.reject(err);
    }

    if (warnings.length) {
      err = new Error(
        `found ${warnings.length} import warnings: \n\n${warnings.join('\n----\n')}`);

      return Promise.reject(err);
    }

    getBpmnJS().invoke(test);
  });
}

// eslint-disable-next-line
function verifyOnly(name, test) {
  return verify(name, test, it.only);
}

function signal(...args) {
  return getBpmnJS().invoke(function(simulator) {
    return simulator.signal(...args);
  });
}

function setConfig(...args) {
  return getBpmnJS().invoke(function(simulator) {
    return simulator.setConfig(...args);
  });
}

function element(id) {
  return getBpmnJS().invoke(function(elementRegistry) {
    const e = elementRegistry.get(id);

    if (!e) {
      throw new Error(`no element <${id}>`);
    }

    return e;
  });
}

function waitAtElement(element) {
  return getBpmnJS().invoke(function(simulator) {
    return simulator.waitAtElement(element);
  });
}

function findScope(filter) {
  return getBpmnJS().invoke(function(simulator) {
    return simulator.findScope(filter);
  });
}

function expectTrace(expectedTrace) {

  return getBpmnJS().invoke(function(simulationTrace, simulationScopes) {

    try {
      const trace = simulationTrace.slice().map(
        t => [
          t.action,
          t.element && t.element.id || 'null',
          t.scope && t.scope.id || 'null'
        ].join(':')
      );

      verifyTrace(trace, expectedTrace, simulationScopes);
    } finally {
      simulationTrace.length = 0;
    }
  });
}

function verifyTrace(trace, expectedTrace, scopes) {
  const adjustedExpectedTrace = [];

  expectedTrace.forEach((event, index) => {
    const split = event.split(':'),
          scope = split[ 2 ];

    if (!scopes[ scope ]) {
      scopes[ scope ] = trace[ index ] ? trace[ index ].split(':')[ 2 ] : scope;
    }

    adjustedExpectedTrace.push(
      [ split[ 0 ], split[ 1 ], scopes[ scope ] ].join(':')
    );
  });

  expect(trace).to.eql(adjustedExpectedTrace);
}