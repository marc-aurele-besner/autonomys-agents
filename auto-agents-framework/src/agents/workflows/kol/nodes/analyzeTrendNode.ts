import { AIMessage } from '@langchain/core/messages';
import { WorkflowConfig } from '../types.js';
import { createLogger } from '../../../../utils/logger.js';
import { State } from '../workflow.js';
import { trendParser, trendPrompt } from '../prompts.js';

const logger = createLogger('analyze-timeline-trend-node');

export const createAnalyzeTrendNode =
  (config: WorkflowConfig) => async (state: typeof State.State) => {
    logger.info('Analyze Trend Node - Analyzing trends');

    const tweets = Array.from(state.timelineTweets.values()).map(({ username, text }) => ({
      username,
      text,
    }));
    logger.info('Tweets:', { tweets: tweets.length });

    const trendAnalysis = await trendPrompt
      .pipe(config.llms.analyze)
      .pipe(trendParser)
      .invoke({
        tweets: JSON.stringify(tweets),
      });

    logger.info('Trend analysis:', trendAnalysis);

    return {
      trendAnalysis,
    };
  };
