import { useState } from 'react'
import {
    Box,
    Flex,
    Heading,
    Button,
    Stack,
    Card,
    Dialog,
    Portal,
    Image,
    HStack,
    Badge,
    DataList,
    CloseButton,
    Text,
    SimpleGrid
} from '@chakra-ui/react'
import { FaPlus, FaEye, FaEdit, FaLayerGroup, FaTrashAlt } from "react-icons/fa";


// Define your item type
interface Item {
    id: string
    nameEn: string
    descriptionEn: string
    quantity: number
    price: number
    mainImage: string
    images: string[]
    nameGe: string
    nameRu: string
    descriptionGe: string
    descriptionRu: string
}

const ItemsAdminPage = () => {
    const [items, setItems] = useState<Item[]>([
        {
            id: '1',
            nameEn: 'Fast Charger',
            descriptionEn: 'High-speed EV charger for home use.',
            quantity: 10,
            price: 299,
            mainImage: 'https://placehold.co/300x200',
            images: [
                'https://placehold.co/300x200',
                'https://placehold.co/300x200',
                'https://placehold.co/300x200',
                'https://placehold.co/300x200',
                'https://placehold.co/300x200',
                'https://placehold.co/300x200',
                'https://placehold.co/300x200',
                'https://placehold.co/300x200',
            ],
            nameGe: 'სწრაფი დამტენი',
            nameRu: 'Быстрое зарядное устройство',
            descriptionGe: 'საუკეთესო სწრაფი დამტენი სახლში გამოსაყენებლად.',
            descriptionRu: 'Высокоскоростное зарядное устройство для дома.'
        },
        {
            id: '2',
            nameEn: 'OBD-II Scanner',
            descriptionEn: 'Diagnostic tool for EV maintenance.',
            quantity: 5,
            price: 149,
            mainImage: 'https://placehold.co/300x200',
            images: [
                'https://placehold.co/300x200',
                'https://placehold.co/300x200',
            ],
            nameGe: 'OBD-II სკანერი',
            nameRu: 'OBD-II сканер',
            descriptionGe: 'დიაგნოსტიკური ხელსაწყო EV-ის მომსახურებისთვის.',
            descriptionRu: 'Диагностический инструмент для обслуживания электромобилей.'
        },
        {
            id: '3',
            nameEn: 'Portable Charger',
            descriptionEn: 'Compact charger for on-the-go charging.',
            quantity: 20,
            price: 99,
            mainImage: 'https://placehold.co/300x200',
            images: [
                'https://placehold.co/300x200',
                'https://placehold.co/300x200',
                'https://placehold.co/300x200'
            ],
            nameGe: 'პორტატული დამტენი',
            nameRu: 'Портативное зарядное устройство',
            descriptionGe: 'კომპაქტური დამტენი გზაზე დატენვისთვის.',
            descriptionRu: 'Компактное зарядное устройство для зарядки в пути.'
        }
    ])

    const handleDelete = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id))
    }

    return (
        <Box p={8} maxW="800px" mx="auto">
            {/* Header with Create Button */}
            <Flex justify="space-between" align="center" mb={6}>
                <Heading >
                    <HStack>
                        <FaLayerGroup />Items
                    </HStack>
                </Heading>
                <Button
                    asChild
                >

                    <a href="/cms-admin/items/create">
                        Create Item <FaPlus />
                    </a>
                </Button>
            </Flex>

            <Stack gap={5}>
                {items.map(item => (
                    <Card.Root key={item.id} overflow="hidden" size="sm" flexDirection={{ base: 'column', md: 'row' }}>
                        <Image
                            objectFit="cover"
                            maxW={{ base: '100%', md: '200px' }}
                            maxH={{ base: '150px', md: '100%' }}
                            src={item.mainImage}
                            alt={item.nameEn}
                        />
                        <Box>
                            <Card.Body>
                                <Card.Title mb="2">{item.nameEn}</Card.Title>
                                <Card.Description>
                                    {item.descriptionEn}
                                </Card.Description>
                                <HStack mt="4">
                                    <Badge>Price: {item.price} $</Badge>
                                    <Badge>quantity: {item.quantity}</Badge>
                                </HStack>
                            </Card.Body>
                            <Card.Footer>

                                {/* View details dialog */}
                                <Dialog.Root scrollBehavior="inside" size="lg">
                                    <Dialog.Trigger asChild>
                                        <Button size="sm" variant="outline" mr={2}>
                                            <FaEye />
                                            <Box display={{ base: 'none', md: 'inline' }}>
                                                View
                                            </Box>
                                        </Button>
                                    </Dialog.Trigger>
                                    <Portal>
                                        <Dialog.Backdrop />
                                        <Dialog.Positioner>
                                            <Dialog.Content>
                                                <Dialog.Header>
                                                    <Dialog.Title>Item Details</Dialog.Title>
                                                    <Dialog.CloseTrigger asChild>
                                                        <CloseButton size="sm" />
                                                    </Dialog.CloseTrigger>
                                                </Dialog.Header>
                                                <Dialog.Body pb={8}>
                                                    <DataList.Root orientation="vertical">
                                                        <DataList.Item>
                                                            <DataList.ItemLabel>Name (EN)</DataList.ItemLabel>
                                                            <DataList.ItemValue>{item.nameEn}</DataList.ItemValue>
                                                        </DataList.Item>
                                                        <DataList.Item>
                                                            <DataList.ItemLabel>Name (GE)</DataList.ItemLabel>
                                                            <DataList.ItemValue>{item.nameGe}</DataList.ItemValue>
                                                        </DataList.Item>
                                                        <DataList.Item>
                                                            <DataList.ItemLabel>Name (RU)</DataList.ItemLabel>
                                                            <DataList.ItemValue>{item.nameRu}</DataList.ItemValue>
                                                        </DataList.Item>
                                                        <DataList.Item>
                                                            <DataList.ItemLabel>Description (EN)</DataList.ItemLabel>
                                                            <DataList.ItemValue>{item.descriptionEn}</DataList.ItemValue>
                                                        </DataList.Item>
                                                        <DataList.Item>
                                                            <DataList.ItemLabel>Description (GE)</DataList.ItemLabel>
                                                            <DataList.ItemValue>{item.descriptionGe}</DataList.ItemValue>
                                                        </DataList.Item>
                                                        <DataList.Item>
                                                            <DataList.ItemLabel>Description (RU)</DataList.ItemLabel>
                                                            <DataList.ItemValue>{item.descriptionRu}</DataList.ItemValue>
                                                        </DataList.Item>
                                                        <DataList.Item>
                                                            <DataList.ItemLabel>Price</DataList.ItemLabel>
                                                            <DataList.ItemValue>${item.price}</DataList.ItemValue>
                                                        </DataList.Item>
                                                        <DataList.Item>
                                                            <DataList.ItemLabel>Quantity</DataList.ItemLabel>
                                                            <DataList.ItemValue>{item.quantity}</DataList.ItemValue>
                                                        </DataList.Item>
                                                    </DataList.Root>

                                                    {item.images.length > 0 && (
                                                        <Box mt={6}>
                                                            <Text fontWeight="semibold" mb={2}>Additional Images</Text>
                                                            <SimpleGrid columns={3} gap={2}>
                                                                {item.images.map((src, idx) => (
                                                                    <Image
                                                                        key={idx}
                                                                        src={src}
                                                                        alt={`Image ${idx + 1}`}
                                                                        objectFit="cover"
                                                                        w="100%"
                                                                        aspectRatio="1"
                                                                        borderRadius="md"
                                                                    />
                                                                ))}
                                                            </SimpleGrid>
                                                        </Box>
                                                    )}
                                                </Dialog.Body>
                                                <Dialog.CloseTrigger asChild>
                                                    <CloseButton size="sm" />
                                                </Dialog.CloseTrigger>
                                            </Dialog.Content>
                                        </Dialog.Positioner>
                                    </Portal>
                                </Dialog.Root>

                                {/* Edit button */}
                                <Button
                                    size="sm"
                                    variant="outline"
                                    mr={2}
                                    asChild
                                >
                                    <a href={`/cms-admin/items/${item.id}`}>
                                        <FaEdit />
                                        <Box display={{ base: 'none', md: 'inline' }}>
                                            Edit
                                        </Box>
                                    </a>
                                </Button>

                                {/* Delete confirmation dialog */}
                                <Dialog.Root>
                                    <Dialog.Trigger asChild>
                                        <Button size="sm" colorPalette="red">
                                            <FaTrashAlt />
                                            <Box display={{ base: 'none', md: 'inline' }}>
                                                Delete
                                            </Box>
                                        </Button>
                                    </Dialog.Trigger>
                                    <Portal>
                                        <Dialog.Backdrop />
                                        <Dialog.Positioner>
                                            <Dialog.Content>
                                                <Dialog.Header>
                                                    <Dialog.Title>Confirm Deletion</Dialog.Title>
                                                    <Dialog.CloseTrigger asChild>
                                                        <CloseButton size="sm" />
                                                    </Dialog.CloseTrigger>
                                                </Dialog.Header>
                                                <Dialog.Body>
                                                    Are you sure you want to delete “{item.nameEn}”?
                                                </Dialog.Body>
                                                <Dialog.Footer>
                                                    <Dialog.ActionTrigger>
                                                        <Button variant="outline">Cancel</Button>
                                                    </Dialog.ActionTrigger>
                                                    <Button
                                                        colorPalette="red"
                                                        onClick={() => handleDelete(item.id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </Dialog.Footer>
                                            </Dialog.Content>
                                        </Dialog.Positioner>
                                    </Portal>
                                </Dialog.Root>
                            </Card.Footer>
                        </Box>
                    </Card.Root>
                ))}
            </Stack>
        </Box>
    )
}

export default ItemsAdminPage
