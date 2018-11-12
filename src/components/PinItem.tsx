import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import LinkPreview from 'react-native-link-preview';
import { times } from 'lodash';
import Placeholder from 'rn-placeholder';

interface IMetaLinkData {
  images?: string[],
  title?: string,
  didLoad: boolean,
  error: boolean,
}

class PinItem extends React.Component<{ link: string, rate: number }, IMetaLinkData> {
  public state: IMetaLinkData = {
    didLoad: false,
    error: false
  }

  public componentDidMount() {
    LinkPreview.getPreview(this.props.link)
      .then((data: any) => {
        console.log(' META DATA: ', data);
        this.setState({ ...data, didLoad: true });
      })
      .catch(() => this.setState({ error: true }));
  }
  
  public render() {
    if (this.state.error) return null
    if (!this.state.didLoad) return <View style={{borderBottomColor: 'white', borderBottomWidth: 1, borderStyle: 'solid'}}><Placeholder.ImageContent
                                      size={100}
                                      animate="fade"
                                      lineNumber={4}
                                      lineSpacing={5}
                                      lastLineWidth="30%"
                                      firstLineWidth="0%" /></View>
    return (
      <TouchableOpacity style={{ flexDirection: 'row', width: '100%', borderBottomColor: '#E1E7ED', borderBottomWidth: 1, borderStyle: 'solid' }} onPress={() => Linking.openURL(this.props.link)}>
        <Image style={{ width: 100, height: 100 }} source={{ uri: this.state.images![0] }} />
        <View style={{ padding: 10, flex: 1 }}>
          <Text>{this.state.title}</Text>
          <View style={{ flexDirection: 'row' }}>
            {
              times(this.props.rate || 0, () => <Icon name="star" />)
            }
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

export default PinItem;