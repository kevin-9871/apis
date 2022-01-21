import { Model } from 'mongoose';
import { StudioModel } from 'src/modules/studio/models';
import { GalleryModel, PhotoModel, ProductModel, VideoModel } from '../../performer-assets/models';
import { UserModel } from '../../user/models';
import { PerformerModel } from '../../performer/models';
import { OrderModel } from '../../payment/models';
import { EarningModel } from '../../earning/models/earning.model';
export declare class StatisticService {
    private readonly galleryModel;
    private readonly photoModel;
    private readonly productModel;
    private readonly videoModel;
    private readonly userModel;
    private readonly performerModel;
    private readonly studioModel;
    private readonly orderModel;
    private readonly earningModel;
    constructor(galleryModel: Model<GalleryModel>, photoModel: Model<PhotoModel>, productModel: Model<ProductModel>, videoModel: Model<VideoModel>, userModel: Model<UserModel>, performerModel: Model<PerformerModel>, studioModel: Model<StudioModel>, orderModel: Model<OrderModel>, earningModel: Model<EarningModel>);
    stats(): Promise<any>;
}
