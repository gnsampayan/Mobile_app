import React, { useState, useEffect, useRef, useContext, createContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Swipeable } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ListItem as ListItemType } from '../types';
import styles from '../../styles';
import { getColorForIndex } from '../utils/colorUtils';
import { TRANSPARENT_OPACITY } from '../constants/constants';
import { Dimensions } from 'react-native';

// Create a context to manage the currently swiped item
const SwipedItemContext = createContext<{
    swipedItemId: string | null;
    setSwipedItemId: (id: string | null) => void;
}>({
    swipedItemId: null,
    setSwipedItemId: () => { },
});

interface ListItemProps {
    item: ListItemType;
    index: number;
    nestedItemName: { [key: string]: string };
    setNestedItemName: (name: { [key: string]: string }) => void;
    addNestedListItem: (parentId: string) => void;
    handleLongPress: (item: ListItemType) => void;
    toggleDropdown: (id: string) => void;
    renderRightActions: (id: string) => JSX.Element;
    layerIndex: number[];
    handleEditItem: (id: string, newText: string) => void;
    deleteListItem: (id: string) => void;
}

const ListItem: React.FC<ListItemProps> = ({
    item,
    index,
    nestedItemName,
    setNestedItemName,
    addNestedListItem,
    handleLongPress,
    toggleDropdown,
    renderRightActions,
    layerIndex,
    handleEditItem,
    deleteListItem,
}) => {
    const [opacity, setOpacity] = useState(1);
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(item.key);
    const [isStruckThrough, setIsStruckThrough] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState(getColorForIndex(index, !!item.isObject, layerIndex.length));
    const textInputRef = useRef<TextInput>(null);
    const swipeableRef = useRef<Swipeable>(null);

    const { swipedItemId, setSwipedItemId } = useContext(SwipedItemContext);

    useEffect(() => {
        const loadState = async () => {
            try {
                const savedOpacity = await AsyncStorage.getItem(`opacity-${item.id}`);
                const savedStrikeThrough = await AsyncStorage.getItem(`strikeThrough-${item.id}`);
                const savedBackgroundColor = await AsyncStorage.getItem(`backgroundColor-${item.id}`);
                if (savedOpacity !== null) {
                    setOpacity(parseFloat(savedOpacity));
                }
                if (savedStrikeThrough !== null) {
                    setIsStruckThrough(savedStrikeThrough === 'true');
                }
                if (savedBackgroundColor !== null) {
                    setBackgroundColor(savedBackgroundColor);
                }
            } catch (error) {
                console.error('Failed to load state', error);
            }
        };

        loadState();
    }, [item.id]);

    const handleSave = () => {
        handleEditItem(item.id, text);
        setIsEditing(false);
    };

    const handleEditPress = () => {
        setIsEditing(true);
        setTimeout(() => {
            if (textInputRef.current) {
                textInputRef.current.focus();
                textInputRef.current.setSelection(0, text.length);
            }
        }, 100); // Delay to ensure the TextInput is rendered
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setText(item.key); // Reset text to original value
    };

    const handlePress = async () => {
        if (!item.isObject) {
            const newIsStruckThrough = !isStruckThrough;
            setIsStruckThrough(newIsStruckThrough);
            const newBackgroundColor = newIsStruckThrough ? 'rgb(56,56,56)' : getColorForIndex(index, !!item.isObject, layerIndex.length);
            setBackgroundColor(newBackgroundColor);

            try {
                await AsyncStorage.setItem(`strikeThrough-${item.id}`, newIsStruckThrough.toString());
                await AsyncStorage.setItem(`backgroundColor-${item.id}`, newBackgroundColor);
            } catch (error) {
                console.error('Failed to save state', error);
            }
        } else {
            // If the item is being transformed into a list object, clear the strike-through state
            if (isStruckThrough) {
                setIsStruckThrough(false);
                setBackgroundColor(getColorForIndex(index, !!item.isObject, layerIndex.length));
                try {
                    await AsyncStorage.setItem(`strikeThrough-${item.id}`, 'false');
                    await AsyncStorage.setItem(`backgroundColor-${item.id}`, getColorForIndex(index, !!item.isObject, layerIndex.length));
                } catch (error) {
                    console.error('Failed to save state', error);
                }
            }
        }
        toggleDropdown(item.id);
        if (swipedItemId && swipedItemId !== item.id && swipeableRef.current) {
            swipeableRef.current.close();
            setSwipedItemId(null);
        }
    };

    const handleOutsidePress = () => {
        if (swipedItemId && swipeableRef.current) {
            swipeableRef.current.close();
            setSwipedItemId(null);
        }
    };

    const handleSwipeableOpen = () => {
        setSwipedItemId(item.id);
    };

    return (
        <TouchableWithoutFeedback onPress={handleOutsidePress}>
            <View>
                <TouchableOpacity onPress={handlePress} onLongPress={() => handleLongPress(item)} activeOpacity={1}>
                    <Swipeable
                        ref={swipeableRef}
                        renderRightActions={() => (
                            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteListItem(item.id)}>
                                <Ionicons name="trash" size={20} color="white" />
                            </TouchableOpacity>
                        )}
                        renderLeftActions={() => (
                            <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
                                <Ionicons name="pencil" size={20} color="white" />
                            </TouchableOpacity>
                        )}
                        onSwipeableOpen={handleSwipeableOpen}
                        onSwipeableWillOpen={() => { }}
                        onSwipeableClose={() => setSwipedItemId(null)} // Reset swipedItemId on close
                    >
                        <View
                            style={[styles.listItem, item.isObject && styles.listObject, { backgroundColor, opacity }, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}
                        >
                            {isEditing ? (
                                <TextInput
                                    ref={textInputRef}
                                    style={styles.nestedInput}
                                    value={text}
                                    onChangeText={setText}
                                    onSubmitEditing={handleSave}
                                    onBlur={handleCancelEdit} // Cancel edit on blur
                                    autoFocus={true} // Ensure keyboard is toggled
                                    selectTextOnFocus={true} // Highlight text on focus
                                />
                            ) : (
                                <Text>
                                    {item.isObject && (
                                        <Text style={styles.normalText}>
                                            [{item.items ? item.items.length : 0}]{' '}
                                        </Text>
                                    )}
                                    <Text style={[
                                        item.isObject ? styles.listObjectText : styles.listItemText,
                                        isStruckThrough && { textDecorationLine: 'line-through' }
                                    ]}>
                                        {item.key}
                                    </Text>
                                </Text>
                            )}
                        </View>
                        {item.isObject && item.showDropdown && (
                            <View style={styles.dropdown}>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.nestedInput}
                                        placeholder="Enter nested list item name"
                                        placeholderTextColor="gray"
                                        value={nestedItemName[item.id] || ''}
                                        onChangeText={(text) => setNestedItemName({ ...nestedItemName, [item.id]: text })}
                                        onSubmitEditing={() => addNestedListItem(item.id)}
                                    />
                                    <Ionicons name="add-circle-outline" size={20} color="white" onPress={() => addNestedListItem(item.id)} />
                                </View>
                                {item.items && item.items.map((nestedItem, nestedIndex) => (
                                    <ListItem
                                        key={nestedItem.id}
                                        item={nestedItem}
                                        index={nestedIndex}
                                        nestedItemName={nestedItemName}
                                        setNestedItemName={setNestedItemName}
                                        addNestedListItem={addNestedListItem}
                                        handleLongPress={handleLongPress}
                                        toggleDropdown={toggleDropdown}
                                        renderRightActions={renderRightActions}
                                        layerIndex={[...layerIndex, nestedIndex]}
                                        handleEditItem={handleEditItem}
                                        deleteListItem={deleteListItem}
                                    />
                                ))}
                            </View>
                        )}
                    </Swipeable>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
};

const ListApp: React.FC = () => {
    const [swipedItemId, setSwipedItemId] = useState<string | null>(null);

    const handleOutsidePress = () => {
        if (swipedItemId) {
            setSwipedItemId(null);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={handleOutsidePress}>
            <View style={{ flex: 1 }}>
                <SwipedItemContext.Provider value={{ swipedItemId, setSwipedItemId }}>
                    {/* Render your list of ListItem components here */}
                </SwipedItemContext.Provider>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default ListItem;
