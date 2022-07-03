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

export const createContext  =  <TState, TActions extends {[key: string] : (state: any, payload: any) => TState  }>(context: TContext<TState, TActions>) => {
    const StateContext = React.createContext<
        {state: TState; dispatch: Dispatch} | undefined
        >(undefined)
    const functions = Object.keys(context.actions);

    const Reducer = (state: TState, action: Action) => {
        if(functions.includes(action.type) && context.actions[action.type] ) {
            return context.actions[action.type]?.(state, action.payload) || state;
        }
        return state;
    }



    const Provider = ({children}: {children: React.ReactNode}) => {
        const [state, dispatch] = React.useReducer(Reducer,  context.initialState);
        const value = {state, dispatch}
        return (
            <StateContext.Provider value={value}>
                {children}
            </StateContext.Provider>
        )
    }

    const  useStore = <K,>(selector: TSelector<TState,K>  ) : K => {
        const context = React.useContext(StateContext)

        if (context === undefined) {
            throw new Error('useContextMenu must be used within a Provider')
        }
        return selector(context.state)
    }

    const useActions = () :{[key in keyof TActions] : (payload: Parameters<TActions[key]>[1] ) => void}  => {
        const contextRes = React.useContext(StateContext)
        if (contextRes === undefined) {
            throw new Error('useContextMenu must be used within a Provider')
        }
        const resUseAction : any = {}

        for (let i = 0; i < Object.keys(context.actions)?.length; i++ ) {
            const [key,action] = Object.entries(context.actions)[i]
            resUseAction[key as keyof TActions] = (payload : Parameters<typeof action>[1] ) => {
                contextRes.dispatch({
                    type: key,
                    payload: payload
                })
            }
        }

        return resUseAction as {[key in keyof TActions] : (payload: Parameters<TActions[key]> ) => void} ;
    }

    return {Provider, useStore, useActions};
}




