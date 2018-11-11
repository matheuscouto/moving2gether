import * as React from 'react';
import { isEqual } from 'lodash';

import firebase, { RNFirebase } from 'react-native-firebase';

export type RNFirebaseDatabaseRef = RNFirebase.database.Reference;
export type RNFirebaseDatabaseQuery = RNFirebase.database.Query;
export type RNFirebaseDatabaseDataSnapshot = RNFirebase.database.DataSnapshot;
export type RNFirebaseDatabaseError = RNFirebase.RnError;

interface IProps {
    path: string;
    eventName?: 'value' | 'child_added';
    snapMap?: (snap: RNFirebaseDatabaseDataSnapshot) => any;
    errorMap?: (error: RNFirebaseDatabaseError) => any;
    withRef?: (ref: RNFirebaseDatabaseRef) => RNFirebaseDatabaseRef | RNFirebaseDatabaseQuery;
    children: (
			loading: boolean,
			error: any,
			data: any,
	) => React.ReactNode;
}
interface IState {
    data: any;
    error: any;
    loading: boolean;
}
const defaultSnapMap = (dataSnapshot: RNFirebaseDatabaseDataSnapshot): any => dataSnapshot.val();
const defaultErrorMap = (error: RNFirebaseDatabaseError): RNFirebaseDatabaseError => error;
const defaultWithRef = (ref: RNFirebaseDatabaseRef): RNFirebaseDatabaseRef => ref;
export default class DatabaseObservable extends React.Component<IProps, IState> {
    public state: IState = {
        data: null,
        error: null,
        loading: true,
    }
    private subscriptionCallback?: any;
    public componentDidMount() {
        this.subscribe(this.props)
    }
    public componentWillUnmount() {
        this.unsubscribe(this.props);
    }
    public componentDidUpdate(prevProps: IProps) {
        if (!isEqual(this.props.path, prevProps.path)) {
            this.unsubscribe(prevProps);
            this.setState({ data: null, error: null, loading: true })
            this.subscribe(this.props);
        }
    }
    public subscribe(props: IProps) {
        const { path, eventName } = props;
        this.subscriptionCallback = (dataSnapshot: RNFirebaseDatabaseDataSnapshot) => {
            const snapMap = this.props.snapMap || defaultSnapMap;
            const data = snapMap(dataSnapshot);
            this.setState({ data, error: null, loading: false })
        }
        
        const withRef = this.props.withRef || defaultWithRef;
        withRef(firebase.database().ref(path))
            .on(eventName || 'value', this.subscriptionCallback, (firebaseError: RNFirebaseDatabaseError) => {
                const errorMap = this.props.errorMap || defaultErrorMap;
                const error = errorMap(firebaseError);
            this.setState({ data: null, error, loading: false })
        })
    }
    public unsubscribe(props: IProps) {
        const { path, eventName } = props;
        firebase.database().ref(path).off(eventName || 'value', this.subscriptionCallback);
    }
    public render() {
			return this.props.children(
				this.state.loading,
				this.state.error,
				this.state.data,
			);
    }
}