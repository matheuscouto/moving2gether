import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking, Dimensions, ActivityIndicator } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
// import LinkPreview from 'react-native-link-preview';
import Placeholder from 'rn-placeholder';
import { times } from 'lodash';
import axios from 'axios';
import Swipeout from 'react-native-swipeout';
import moment from 'moment';

// interface IMetaLinkData {
//   images?: string[],
//   title?: string,
//   didLoad: boolean,
//   error: boolean,
// }

interface IMetaLinkData {publisher: string, image: { url: string }, title: string, logo: { url: string }, description: string}

interface IState { didLoad: boolean, error: boolean, data?: IMetaLinkData}

interface IProps {
  link: string,
  rate?: number,
  isValidLink?: (isValid: boolean) => void,
  fullMargin: boolean,
  button?:boolean,
  unpinIdea?: () => void,
  editRating?: (rate: number) => () => void,
  navigate?: any;
  viewMode?: 'list' | 'image';
  creationTime?: number;
}

class PinItem extends React.Component<IProps , IState> {
  public state: IState = {
    didLoad: false,
    error: false
  }

  private handleNavigate = (route: string, params?: any) => () => {
    this.props.navigate(route, params)
  }

  private swipeoutBtns = [
    {
      text: 'Editar nota',
      backgroundColor: "#F59D01",
      onPress: this.props.navigate ? this.handleNavigate('EditRatingModal', { editRating: this.props.editRating, rate: this.props.rate }) : () => null
    },
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
          console.log('METADATA: ', result.data.data)
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
    const { button = true } = this.props;
    if (this.state.error) return null
    if (!this.state.didLoad) {
      if(this.props.viewMode==='list')
        return <View style={{ ...borderPlaceholder, borderStyle: 'solid', width:'100%'}}>
                  <Placeholder.ImageContent
                    size={100}
                    animate="fade"
                    lineNumber={4}
                    lineSpacing={5}
                    lastLineWidth="30%"
                    firstLineWidth="0%" />
                </View>
      return <ActivityIndicator size="large" />
    }
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
    if(this.props.viewMode==='image') {
      // const now = moment().locale('pt');
      return (
        <View style={{height: '50%', width: '100%'}}>
          <View style={{flexDirection: 'row', alignItems: 'center', padding: 10}}>
            <Image style={{ width: 40, height: 40, marginRight: 10, borderRadius: 20 }} source={{ uri: this.state.data!.logo.url }} resizeMode="cover" />
            <Text style={{fontWeight: '700', fontSize: 16}}>{this.state.data!.publisher.toUpperCase()}</Text>
          </View>
          <Image style={{ width: Dimensions.get('window').width, height: (Dimensions.get('window').width/3*2) }} source={{ uri: this.state.data!.image.url }} resizeMode="cover" />
          <View style={{ padding: 10, flex: 1 }}>
            <TouchableOpacity style={{ flexDirection: 'row', marginTop: 5, marginBottom: 10 }} onPress={this.props.navigate ? this.handleNavigate('EditRatingModal', { editRating: this.props.editRating, rate: this.props.rate }) : () => null}>
              {
                times(this.props.rate || 0, (n) => <Icon name="ios-star" color="#F59D01" size={20} key={n} />)
              }
              {
                ((5 - (this.props.rate || 5)) > 0)
                ? times((5 - (this.props.rate || 5)), (n) => <Icon name="ios-star-outline" color="#F59D01" size={20} key={n} />)
                : null
              }
            </TouchableOpacity>
            <Text numberOfLines={4}>{this.state.data!.description}</Text>
          </View>
          {/* <Text>{`${now.format('DD').toUpperCase()} DE ${now.format('MMMM').toUpperCase()}`}</Text> */}
        </View>
      )
    }

    return (
      <Swipeout right={this.swipeoutBtns} backgroundColor="white" autoClose={true}>
        <TouchableOpacity style={{ flexDirection: 'row', width: '100%', ...border, borderStyle: 'solid' }} onPress={() => Linking.openURL(this.props.link)}>
          <Image style={{ width: this.props.fullMargin ? 100 : 150, height: this.props.fullMargin ? undefined : 100 }} source={{ uri: this.state.data!.image.url }} resizeMode="cover" />
          <View style={{ padding: 10, flex: 1 }}>
            <Text numberOfLines={3}>{this.state.data!.title}</Text>
            <View style={{ flexDirection: 'row', marginTop: 5 }}>
              {
                times(this.props.rate || 0, (n) => <Icon name="ios-star" key={n} />)
              }
            </View>
          </View>
        </TouchableOpacity>
      </Swipeout>
    )
  }
}
export default PinItem;