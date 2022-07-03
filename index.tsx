import * as React from "react";


type Action<PayloadData = any> = {
    type: string
    payload?: PayloadData
}

type TContext <TState, TActions> = {
    initialState: TState,
    actions: TActions
}

type Dispatch = (action: Action) => void
type TSelector<T, TSelected extends unknown> = (state: T) => TSelected;

export const createContext  =  <TState, TActions extends {[key: string] : (state: TState, payload: any) => TState  }>(context: TContext<TState, TActions>) => {
    const StateContext = React.createContext<
        TState | undefined
        >(undefined)
    const ActionsContext = React.createContext<
        Dispatch | undefined
        >(undefined)


    const functions = Object.keys(context.actions);

    const Reducer = (state: TState, action: Action) => {
        if(functions.includes(action.type) && context.actions[action.type] ) {
            return context.actions[action.type]?.(state, action.payload);
        }
        return state;
    }



    const Provider = ({children}: {children: React.ReactNode}) => {
        const [state, dispatch] = React.useReducer(Reducer,  context.initialState);
        return (
            <StateContext.Provider value={state}>
                <ActionsContext.Provider value={dispatch}>
                    {children}
                </ActionsContext.Provider>
            </StateContext.Provider>
        )
    }

    const  useStore = <K,>(selector: TSelector<TState,K>  ) : K => {
        const state = React.useContext(StateContext)

        if (state === undefined) {
            throw new Error('useContextMenu must be used within a Provider')
        }
        return selector(state);
    }

    const useActions = () :{[key in keyof TActions] : (payload: Parameters<TActions[key]>[1] ) => void}  => {
        const dispatch = React.useContext(ActionsContext)
        if (dispatch === undefined) {
            throw new Error('useContextMenu must be used within a Provider')
        }
        const resUseAction : any = {}

        for (let i = 0; i < Object.keys(context.actions)?.length; i++ ) {
            const [key,action] = Object.entries(context.actions)[i]
            resUseAction[key as keyof TActions] = (payload : Parameters<typeof action>[1] ) => {
                dispatch({
                    type: key,
                    payload: payload
                })
            }
        }

        return resUseAction as {[key in keyof TActions] : (payload: Parameters<TActions[key]> ) => void} ;
    }

    return {Provider, useStore, useActions};
}

