import { useState } from "react";
import { BASE_URL } from "../../../../config";
import useFetchData from "../../../Hook/userFecthData";
import plusImage from "../../../assets/images/feature.png";
import AddZone from "./addZone";
import AddRackAndPallet from "./addRackAndPallet";
import StockIn from "../stockIn/stockIn"

const Zone = () => {
    const { data: location = [] } = useFetchData(`${BASE_URL}/location`);
    const { data: zone = [] } = useFetchData(`${BASE_URL}/zone`);

    const [showModal, setShowModal] = useState(false);
    const [open, setOpen] = useState(false);
    const [openStockIn, setOpenStockIn] = useState(false);
    const [selectedName, setSelectedName] = useState('');
    const [selectedId, setSelectedId] = useState('');

    const handleOpen = (zoneName, zoneId) => {
        setOpen(true);
        setSelectedName(zoneName);
        setSelectedId(zoneId);
    };

    const handleClose = () => {
        setSelectedName(null);
        setSelectedId(null);
        setOpen(false);
    };
    const stopPropagation = (e) => {
        e.stopPropagation();
    };

    const groupedLocations = location.reduce((acc, item) => {
        if (!item.zone) return acc;
    
        const zoneName = item.zone.name;
        const rackId = item.rack;
        const selectIdItem = item._id;
        const zoneId = item.zone._id;
        const levelId = item.level;
        const palletName = item.pallet;
        const productIds = item.products.map(pro => pro._id); // Lưu trữ mảng productId
    
        console.log("checkkk", productIds);
    
        // Khởi tạo zone nếu chưa tồn tại
        if (!acc[zoneName]) {
            acc[zoneName] = {
                zoneId: zoneId,
                zone: zoneName,
                racks: {},
                pallets: {},
            };
        }
    
        // Xử lý racks
        if (rackId) {
            if (!acc[zoneName].racks[rackId]) {
                acc[zoneName].racks[rackId] = {
                    rack: rackId,
                    levels: {},
                };
            }
            // Xử lý levels
            if (levelId) {
                if (!acc[zoneName].racks[rackId].levels[levelId]) {
                    acc[zoneName].racks[rackId].levels[levelId] = {
                        products: {}, // Khởi tạo products
                        _id: selectIdItem,
                    };
                }
                // Thêm sản phẩm vào products
                productIds.forEach(productId => {
                    if (!acc[zoneName].racks[rackId].levels[levelId].products[productId]) {
                        acc[zoneName].racks[rackId].levels[levelId].products[productId] = {
                            product: productId,
                        };
                    }
                });
            }
        }
    
        // Xử lý pallets
        if (palletName) {
            if (!acc[zoneName].pallets[palletName]) {
                acc[zoneName].pallets[palletName] = {
                    products: {}, // Khởi tạo mảng products cho pallet
                    _id: selectIdItem,
                };
            }
            // Thêm sản phẩm vào pallet
            productIds.forEach(productId => {
                if (!acc[zoneName].pallets[palletName].products[productId]) {
                    acc[zoneName].pallets[palletName].products[productId] = {
                        product: productId,
                    };
                }
            });
        }
    
        return acc;
    }, {});
    
    // Sắp xếp các level trong groupedLocations
    for (const zone in groupedLocations) {
        for (const rack in groupedLocations[zone].racks) {
            groupedLocations[zone].racks[rack].levels = Object.entries(groupedLocations[zone].racks[rack].levels)
                .map(([levelId, { products, _id }]) => ({
                    levelId,
                    products: Object.values(products), // Chuyển đổi thành mảng
                    _id
                }))
                .sort((a, b) => a.levelId - b.levelId);
        }
        // Chuyển pallets thành mảng và sắp xếp các sản phẩm
        for (const pallet in groupedLocations[zone].pallets) {
            groupedLocations[zone].pallets[pallet].products = Object.values(groupedLocations[zone].pallets[pallet].products);
        }
        groupedLocations[zone].pallets = Object.entries(groupedLocations[zone].pallets);
    }
    
    // Đảm bảo các zone tồn tại trong groupedLocations
    zone.forEach(zoneItem => {
        const zoneName = zoneItem.name;
        const zoneId = zoneItem._id;
        if (!groupedLocations[zoneName]) {
            groupedLocations[zoneName] = {
                zoneId,
                zone: zoneName,
                racks: {},
                pallets: {}
            };
        }
    });
    
    console.log(groupedLocations);
    
    
    const handleOpenStockIn = (id)=>{
        setOpenStockIn(true);
        setSelectedId(id)

    }
    const handleCloseStockIn = ()=>{
        setSelectedId(null)
        setOpenStockIn(false);

    }

    return (
        <div className="grid grid-cols-4 gap-2 ml-3">
            {Object.keys(groupedLocations).length === 0 ? (
                <p className="col-span-4 text-center text-red-500">Không có khu vực nào được tìm thấy.</p>
            ) : (
                Object.values(groupedLocations).map((group, index) => (
                    <div key={index} className="border-2 p-2 pt-3 border-solid border-blue-200 relative">
                        <div className="absolute uppercase -top-5 bg-white p-1">
                            <h3>{group.zone}</h3>
                        </div>
                        <div>
                            {Object.values(group.racks).map((rack) => (
                                <div key={rack.rack}>
                                    <p className="text-left font-semibold">{rack.rack}</p>
                                    <div className="border-2 px-4 py-2 grid grid-cols-3 gap-2 border-blue-400 cursor-pointer">
                                        {rack.levels.map(({ levelId, products,_id }) => (
                                            <div key={levelId} className="text-center border-2 bg-blue-400" onClick={()=>handleOpenStockIn(_id)}>
                                                <p className={products.length >0 ? 'text-red-400' : 'text-white'}>
                                                    Tầng {levelId}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {Object.values(group.pallets).map(([palletName, palletData]) => (
                                <div key={palletData._id}>
                                    <div onClick={()=>handleOpenStockIn(palletData._id)} className={`border-2 text-center mt-2 px-4 py-2 text-white cursor-pointer bg-orange-400`}>
                                        <p className={palletData.products.length > 0 ? 'text-red-500' : 'text-white'}>{palletName}</p>
                                        
                                    </div>
                                </div>
                            ))}
                            <div onClick={() => handleOpen(group.zone, group.zoneId)} className="border-2 mt-2 px-4 py-2 border-dashed cursor-pointer">
                                <p className="text-center text-[18px] font-semibold">+</p>
                            </div>
                        </div>
                    </div>
                ))
            )}
            <div onClick={() => setShowModal(true)} className="border-2 p-2 pt-3 border-dashed border-stone-400 cursor-pointer">
                <img src={plusImage} alt="" />
            </div>
            <AddZone showModal={showModal} setShowModal={setShowModal} stopPropagation={stopPropagation} zone={zone} />
            <AddRackAndPallet
                open={open}
                handleClose={handleClose}
                stopPropagation={stopPropagation}
                zone={zone}
                location={location}
                zoneId={selectedId}
                zoneName={selectedName}
            />
            <StockIn
                open={openStockIn}
                handleClose ={handleCloseStockIn}
                locationId = {selectedId}
                stopPropagation={stopPropagation}
                zone={zone}

            />
        </div>
    );
};

export default Zone;
