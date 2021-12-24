import { createScope, ProfilerError, ProfilerColor, ToolbarSlotData } from '@ghadautopia/express-profiler';
import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import { STR_MONGOOSE } from './stream';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M22 18.055v2.458c0 1.925-4.655 3.487-10 3.487-5.344 0-10-1.562-10-3.487v-2.458c2.418 1.738 7.005 2.256 10 2.256 3.006 0 7.588-.523 10-2.256zm-10-3.409c-3.006 0-7.588-.523-10-2.256v2.434c0 1.926 4.656 3.487 10 3.487 5.345 0 10-1.562 10-3.487v-2.434c-2.418 1.738-7.005 2.256-10 2.256zm0-14.646c-5.344 0-10 1.562-10 3.488s4.656 3.487 10 3.487c5.345 0 10-1.562 10-3.487 0-1.926-4.655-3.488-10-3.488zm0 8.975c-3.006 0-7.588-.523-10-2.256v2.44c0 1.926 4.656 3.487 10 3.487 5.345 0 10-1.562 10-3.487v-2.44c-2.418 1.738-7.005 2.256-10 2.256z"/></svg>`;

export const mongooseScope = createScope({
    name: 'mongoose',
    getToolbarSlot: async (streamsData) => {
        const streamData = streamsData.get(STR_MONGOOSE);

        const result: ToolbarSlotData = { 
          text: 'N/A',
          color: ProfilerColor.DISABLED,
          description: 'Mongoose requests count',
          svg
        };

        if (streamData) {
          result.text = `(${streamData.length})`;
          result.color = undefined;
        }

        return result;
    },
    getPageTab: async (streamsData) => {
      const streamData = streamsData.get(STR_MONGOOSE);

      return {
          title: `Mongoose${streamData ? ` (${streamData.length})` : ''}`,
          svg
      }
    },
    getPageView: async (streamsData, profilerViewsDir) => {
      const templateFile = path.join(__dirname, '..', 'views', 'template', 'index.ejs');
      const styles = fs.readFileSync(path.join(__dirname, '..', 'views', 'styles', 'index.css'), 'ascii');
      const script = fs.readFileSync(path.join(__dirname, '..', 'views', 'script', 'index.js'), 'ascii');

      let template = '';
      const streamData = streamsData.get(STR_MONGOOSE);

      const data = streamData || [];

      ejs.renderFile(templateFile, { data, profilerViewsDir }, (err: Error | null, str: string) => {
        if (err) {
          throw new ProfilerError(`PAGE-VIEW RENDER ERROR: ${err}`, 500);
        }
        
        template = str;
      });

      return {
        template,
        styles,
        script, 
      }
    },
});
