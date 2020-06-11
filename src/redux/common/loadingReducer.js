export const loadingReducer = (state = {}, action) => {
  const { type } = action
  const matches = /(.*)_(START|SUCCESS|FAILURE)/.exec(type)
  if (!matches) return state

  const [, requestName, requestState] = matches
  return {
    ...state,
    [requestName]: requestState === 'START',
  }
}