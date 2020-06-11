import _ from 'lodash'

export const createLoadingSelector = actions => state => _(actions)
      .some(action => _.get(state, `loading.${action}`))

export const createErrorMessageSelector = actions => (state) => {
      const res = _(actions)
            .map(action => _.get(state, `error.${action}`))
            .compact()
            .first() || ''
      return res
}

export const createSuccessMessageSelector = actions => state => _(actions)
      .every(action => _.get(state, `success.${action}`))