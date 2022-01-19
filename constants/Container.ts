import Constants from "expo-constants";
// @ts-ignore
import styled from "styled-components"


const statusBarHeight = Constants.statusBarHeight

export const Container = styled.View`
    flex: 1;
    padding: 25px;
    padding-top: ${statusBarHeight + 10};
`

export const InnerContainer = styled.View`
    flex: 1;
    width: 100%;
    align-items: center;
`

export const PageLogo = styled.Image`
    width: 250px;
    height: 250px;
`

export const PageTitle = styled.Text`
    font-size: 30px;
    text-align: center;
    font-weight: bold;
`
