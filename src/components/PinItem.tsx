import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
// import LinkPreview from 'react-native-link-preview';
import Placeholder from 'rn-placeholder';
import { times } from 'lodash';
import axios from 'axios';
import Swipeout from 'react-native-swipeout';

// interface IMetaLinkData {
//   images?: string[],
//   title?: string,
//   didLoad: boolean,
//   error: boolean,
// }

interface IMetaLinkData {publisher: string, image: { url: string }, title: string, logo: { url: string }}

interface IState { didLoad: boolean, error: boolean, data?: IMetaLinkData}

interface IProps { link: string, rate?: number, isValidLink?: (isValid: boolean) => void, fullMargin: boolean, button?:boolean, unpinIdea?: () => void }

class PinItem extends React.Component<IProps, IState> {
  public state: IState = {
    didLoad: false,
    error: false
  }

  private swipeoutBtns = [
    {
      text: 'Deletar',
      backgroundColor: "rgba(231,76,60,1)",
      onPress: this.props.unpinIdea
    }
  ]

  public componentDidMount() {
    if(!this.props.link) {
      this.props.isValidLink!(false)
    }
    else {
      axios.get("https://api.microlink.io/?url=" + this.props.link)
        .then((result: {data: { data: IMetaLinkData}}) => {
          this.setState(state => ({ ...state, data: result.data.data, didLoad: true }));
          if(this.props.isValidLink) {
            this.props.isValidLink(true)
          }
        })
        .catch(() => {
          this.setState({ error: true })
          if(this.props.isValidLink) {
            this.props.isValidLink(false)
          }
        });
    }
    // LinkPreview.getPreview(this.props.link)
    //   .then((data: any) => {
    //     console.log(' META DATA: ', data);
    //     this.setState({ ...data, didLoad: true });
    //     if(this.props.isValidLink) {
    //       this.props.isValidLink(true)
    //     }
    //   })
    //   .catch(() => {
    //     this.setState({ error: true })
    //     if(this.props.isValidLink) {
    //       this.props.isValidLink(false)
    //     }
    //   });
  }
  
  public render() {
    const borderPlaceholder = this.props.fullMargin ? {borderColor: 'white' , borderWidth: 1} : {borderBottomColor: 'white', borderBottomWidth: 1};
    const border = this.props.fullMargin ? {borderColor: '#E1E7ED' , borderWidth: 1} : {borderBottomColor: '#E1E7ED', borderBottomWidth: 1};
    const { button = true } = this.props
    if (this.state.error) return null
    if (!this.state.didLoad) return <View style={{ ...borderPlaceholder, borderStyle: 'solid', width:'100%'}}><Placeholder.ImageContent
                                      size={100}
                                      animate="fade"
                                      lineNumber={4}
                                      lineSpacing={5}
                                      lastLineWidth="30%"
                                      firstLineWidth="0%" /></View>
    if(!button) return   <View style={{ flexDirection: 'row', width: '100%', ...border, borderStyle: 'solid' }}>
                                      <Image style={{ width: this.props.fullMargin ? 100 : 150, height: this.props.fullMargin ? undefined : 100 }} source={{ uri: this.state.data!.image.url }} resizeMode="cover" />
                                      <View style={{ padding: 10, flex: 1 }}>
                                        <Text numberOfLines={3}>{this.state.data!.title}</Text>
                                        <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                          {
                                            times(this.props.rate || 0, (n) => <Icon name="star" key={n} />)
                                          }
                                        </View>
                                      </View>
                                    </View>
    return (
      <Swipeout right={this.swipeoutBtns} backgroundColor="white">
        <TouchableOpacity style={{ flexDirection: 'row', width: '100%', ...border, borderStyle: 'solid' }} onPress={() => Linking.openURL(this.props.link)}>
          <Image style={{ width: this.props.fullMargin ? 100 : 150, height: this.props.fullMargin ? undefined : 100 }} source={{ uri: this.state.data!.image.url }} resizeMode="cover" />
          <View style={{ padding: 10, flex: 1 }}>
            <Text numberOfLines={3}>{this.state.data!.title}</Text>
            <View style={{ flexDirection: 'row', marginTop: 5 }}>
              {
                times(this.props.rate || 0, (n) => <Icon name="star" key={n} />)
              }
            </View>
          </View>
        </TouchableOpacity>
      </Swipeout>
    )
  }
}
export default PinItem;