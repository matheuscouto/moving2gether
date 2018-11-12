import { combineEpics } from 'redux-observable';
import actionCreatorFactory from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers/dist';
import { Epic } from '..';
import { filter, mapTo, mergeMap, catchError, tap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { pinIdea as apiPinIdea } from '../../services/firebase';


// ACTIONS
const actionCreator = actionCreatorFactory('APP::PIN');
export const pinIdea = actionCreator.async<{link: string, category: string, rate: number}, undefined, any>('NEW_PIN');

// STATE
export interface IState {};

const INITIAL_STATE: IState = {};

// REDUCER
export default reducerWithInitialState(INITIAL_STATE)
.build();

// EFFECTS

const pinIdeaEpic: Epic = (action$) => action$.pipe(
    filter(pinIdea.started.match),
    tap(() => console.log(' hey there')),
	mergeMap(({ payload: { link, category, rate } }) => from(apiPinIdea(link, category, rate)).pipe(
		mapTo(pinIdea.done({ params: { link, category, rate } })),
		catchError((error) => of(pinIdea.failed({ params: { link, category, rate }, error: error.code  }))),
	)),
);

export const epics = combineEpics(
    pinIdeaEpic
);