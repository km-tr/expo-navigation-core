import {
  useNavigation,
  useRoute,
  RouteProp,
  ParamListBase,
  NavigationProp,
} from '@react-navigation/native'
import { useCallback } from 'react'
import _ from 'lodash'
import { NavigateTo } from '..'

const prefetch = (routeName: string) => {}

export default function useRouting<
  RProp extends RouteProp<ParamListBase, string> = RouteProp<
    ParamListBase,
    string
  >,
  NProp extends NavigationProp<ParamListBase> = NavigationProp<ParamListBase>
>() {
  // @ts-ignore
  const {
    navigate: nav,
    push: pushTo,
    goBack,
    popToTop,
    replace: rep,
  } = useNavigation<NProp>()

  const { params } = useRoute<RProp>()

  const navigate = useCallback(
    <To extends NavigateTo = NavigateTo>(route: To) => {
      nav({
        name: route.routeName,
        params: route.params,
        key: route.key,
      })
    },
    [nav]
  )
  const push = useCallback(
    <To extends NavigateTo = NavigateTo>(route: To) => {
      if (pushTo) pushTo(route)
      else navigate<To>(route)
    },
    [pushTo, navigate]
  )
  const getParam = <Param>(param: string, fallback?: unknown): Param => {
    return _.get(params, param, fallback)
  }
  const replace = useCallback(
    <To extends NavigateTo = NavigateTo>(route: To) => {
      rep(route.routeName, route.params)
    },
    [rep]
  )

  return {
    navigate,
    getParam,
    push,
    goBack: () => goBack(),
    params,
    prefetch,
    popToTop,
    replace,
  }
}
