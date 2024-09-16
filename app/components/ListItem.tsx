import React, { useState, useEffect, useRef, useContext, createContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, FlatList, Dimensions, Animated } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Swipeable } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ListItem as ListItemType } from '../types';
import styles from '../../styles';
import { getColorForIndex } from '../utils/colorUtils';

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
    handleDeleteListItem: (id: string, key?: string) => void;
    flatListRef: React.RefObject<FlatList<any>>;
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
    handleDeleteListItem = () => { }, // Default parameter
    flatListRef = React.createRef<FlatList<any>>() // Default parameter
}) => {
    const [opacity, setOpacity] = useState(1);
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(item.key);
    const [isStruckThrough, setIsStruckThrough] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState(getColorForIndex(index, !!item.isObject, layerIndex.length));
    const textInputRef = useRef<TextInput>(null);
    const nestedInputRef = useRef<TextInput>(null);
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
        if (swipeableRef.current) {
            swipeableRef.current.close();
        }
        setIsEditing(true);
        setTimeout(() => {
            if (textInputRef.current) {
                textInputRef.current.focus();
                textInputRef.current.setSelection(0, text.length);
            }
        }, 100);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setText(item.key);
    };

    const handlePress = async () => {
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

        if (swipedItemId && swipedItemId !== item.id && swipeableRef.current) {
            swipeableRef.current.close();
            setSwipedItemId(null);
        }
    };

    const handleOutsidePress = () => {
        if (swipeableRef.current) {
            swipeableRef.current.close();
        }
        setSwipedItemId(null);
    };

    const handleSwipeableOpen = () => {
        setSwipedItemId(item.id);
    };

    const scrollToInput = (inputRef: React.RefObject<TextInput>) => {
        setTimeout(() => {
            if (flatListRef.current?.getNativeScrollRef() && inputRef.current) {
                inputRef.current.measureLayout(
                    flatListRef.current.getNativeScrollRef() as any,
                    (_: number, y: number) => {
                        flatListRef.current?.scrollToOffset({
                            offset: y - 100,
                            animated: true,
                        });
                    },
                    () => {
                        console.error('measureLayout failed');
                    }
                );
            }
        }, 100);
    };

    return (
        <TouchableWithoutFeedback onPress={handleOutsidePress}>
            <View>
                <TouchableOpacity onPress={handlePress} onLongPress={() => handleLongPress(item)} activeOpacity={1}>
                    <Swipeable
                        ref={swipeableRef}
                        renderLeftActions={(progress) => {
                            const opacity = progress.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 1],
                                extrapolate: 'clamp',
                            });
                            const left = progress.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 100],
                                extrapolate: 'clamp',
                            });
                            return (
                                <View style={styles.editButtonParent}>
                                    <Animated.View style={[styles.editButton, { opacity, transform: [{ translateX: left }] }]}>
                                        <TouchableOpacity style={{ width: 'auto', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4 }} onPress={handleEditPress}>
                                            <Ionicons name="pencil" size={20} color="black" />
                                            <Text style={{ color: 'black', fontSize: 14 }}>{'edit'}</Text>
                                        </TouchableOpacity>
                                    </Animated.View>
                                </View>
                            );
                        }}
                        renderRightActions={(progress) => {
                            const opacity = progress.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 1],
                                extrapolate: 'clamp',
                            });
                            const right = progress.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, -100],
                                extrapolate: 'clamp',
                            });
                            return (
                                <View style={styles.deleteButtonParent}>
                                    <Animated.View style={[styles.deleteButton, { opacity, transform: [{ translateX: right }] }]}>
                                        <TouchableOpacity style={{ width: 'auto', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4 }} onPress={() => handleDeleteListItem(item.id, item.key)}>
                                            <Ionicons name="trash" size={20} color="white" />
                                            <Text style={{ color: 'white', fontSize: 14 }}>{'delete'}</Text>
                                        </TouchableOpacity>
                                    </Animated.View>
                                </View>
                            );
                        }}
                        onSwipeableOpen={handleSwipeableOpen}
                        onSwipeableWillOpen={() => { }}
                        onSwipeableClose={() => setSwipedItemId(null)}
                    >
                        <View
                            style={[
                                styles.listItem,
                                item.isObject && styles.listObject,
                                { backgroundColor, opacity },
                                { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
                            ]}
                        >
                            {isEditing ? (
                                <TextInput
                                    ref={textInputRef}
                                    style={styles.nestedInput}
                                    value={text}
                                    onChangeText={setText}
                                    onSubmitEditing={handleSave}
                                    onBlur={handleCancelEdit}
                                    autoFocus={true}
                                    selectTextOnFocus={true}
                                    onFocus={() => scrollToInput(textInputRef)}
                                />
                            ) : (
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                    {item.isObject && (
                                        <Text style={styles.normalText}>
                                            [{item.items ? item.items.length : 0}]{' '}
                                        </Text>
                                    )}
                                    <Text
                                        style={[
                                            item.isObject ? styles.listObjectText : styles.listItemText,
                                            isStruckThrough && { textDecorationLine: 'line-through' },
                                        ]}
                                    >
                                        {item.key}
                                    </Text>
                                </View>
                            )}
                            {item.isObject && (() => {
                                const color = item.showDropdown ? '#ffffff31' : 'transparent';
                                return (
                                    <TouchableOpacity style={[styles.dropdownButton, { borderColor: color }]} onPress={() => toggleDropdown(item.id)}>
                                        <Ionicons
                                            name={item.showDropdown ? 'chevron-up' : 'chevron-down'}
                                            size={20}
                                            color="white"
                                        />
                                    </TouchableOpacity>
                                );
                            })()}
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
                                        ref={nestedInputRef}
                                        onFocus={() => scrollToInput(nestedInputRef)}
                                    />
                                    <TouchableOpacity style={styles.addButton} onPress={() => addNestedListItem(item.id)}>
                                        <Ionicons name="add-circle-outline" size={20} color="white" />
                                        <Text style={{ color: 'white', fontSize: 14 }}>{'add'}</Text>
                                    </TouchableOpacity>
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
                                        handleDeleteListItem={handleDeleteListItem}
                                        flatListRef={flatListRef}
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

export default ListItem;
