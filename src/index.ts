import { IRenderMime } from '@jupyterlab/rendermime-interfaces';
import { Message } from '@lumino/messaging';

import { Widget } from '@lumino/widgets';
import '../style/index.css';
/**
 * The default mime type for the extension.
 */
const MIME_TYPE = 'application/nii';
const MIME_TYPE2 = 'application/gzip';
const MIME_TYPE3 = 'application/x-gzip';
declare let papaya: any;
declare let papayaContainers: any[];
//declare var niivue:any;
declare let container_num:number;
container_num = 0;

/**
 * The class name added to the extension.
 */
const CLASS_NAME = 'mimerenderer-nii';

/**
 * A widget for rendering nii.
 */
export class OutputWidget extends Widget implements IRenderMime.IRenderer {
  /**
   * Construct a new output widget.
   */
  Setmmtype(options:IRenderMime.IRendererOptions) {
    this._mimeType = options.mimeType;
  }

  constructor(options: IRenderMime.IRendererOptions) {
    super();
    this.addClass(CLASS_NAME);
    this.Setmmtype(options);
    const _ = container_num;
    if(_===0){
      let s1 = document.createElement('script');
      s1.type = 'text/javascript'
      s1.src = 'https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js'
      s1.onload =() =>{
        console.log('load jquery');
      };
      this.node.appendChild(s1);
      let s2 = document.createElement('script');
      s2.type = 'text/javascript';
      s2.src = 'https://oss.brains.center/papaya.js';
      s2.onload = () => {
        console.log('papaya_object')
        papaya.Container.syncViewers = true;
      };
      this.node.appendChild(s2);
        // var s3 = document.createElement('script');
        // s3.type = 'text/javascript'
        // s3.src = 'https://niivue.github.io/niivue/features/niivue.umd.js'
        // s3.onload =() =>{
        //   console.log('load niivue');
        // }
        // this.node.appendChild(s3);
      console.log('init init');
    }

    // Add an image element to the panel




  }
  protected onResize(msg: Widget.ResizeMessage): void {
    if (this.div_flag){
    papayaContainers[this.div_num].resizeViewerComponents(true);
  }

    
  }
  protected onAfterDetach(msg: Message): void {
    console.log('Detach');
    console.log(this.div_num);
    // const d = this.div_num;
    // alert(d);
    if(this.div_flag){
      delete(papayaContainers[this.div_num]);
    }
  }

  /**
   * Render nii into this widget's node.
   */
  renderModel(model: IRenderMime.IMimeModel): Promise<void> {
    //const flag = this.div_flag;
    //alert(flag);
    if (this.div_flag==false){
    this.div_num = container_num;
    let data = model.data[this._mimeType] as string;
    let pdiv = document.createElement('div');
    pdiv.style.height = "0px";
    pdiv.classList.add("papaya");
    pdiv.id = "papaya"+this.div_num;
    this.node.appendChild(pdiv);
    papaya.Container.addViewer('papaya'+this.div_num,{encodedImages: [data],noNewFiles:true,smoothDisplay:false,syncOverlaySeries:false,ignoreSync:true,showControlBar:true,showControls:true},function(){});
    this.div_flag = true;
    container_num +=1;
    //papayaContainers[container_num].noNewFiles = true;
    
    // let cnavas = document.createElement('canvas')
    // cnavas.id = 'gl'+container_num;

    // this.node.appendChild(cnavas);
    
    // console.log("render model ")
    // console.log(model.metadata)
    // let niiview = new niivue.Niivue()
    // niiview.setRadiologicalConvention(false)
    // niiview.attachTo('gl'+container_num)
    // niiview.scene.loading$.next(true);
    // console.log(this.title)
    // console.log('gl')
    
    // let image = await niivue.NVImage.loadFromBase64({base64:data,name:"name.nii.gz",colorMap:"bule2red"})
    // niiview.scene.loading$.next(false);
    // niiview.addVolume(image)
    
    // niiview.setSliceType(niiview.sliceTypeMultiplanar);
    // niiview.createEmptyDrawing();
      
    // console.log(data);
    //this.div_num = container_num;
    //container_num +=1;
  }
    return Promise.resolve();
  }

  private _mimeType: string;

  private div_num = -1;
  private div_flag = false;

  //private _papaya: any;
}

/**
 * A mime renderer factory for nii data.
 */
export const rendererFactory: IRenderMime.IRendererFactory = {
  safe: true,
  mimeTypes:[MIME_TYPE,MIME_TYPE2,MIME_TYPE3],
  createRenderer: (options) => new OutputWidget(options),
};

/**
 * Extension definition.
 */
const extension: IRenderMime.IExtension = {
  id: 'NiiViewer:plugin',
  rendererFactory,
  rank: 0,
  dataType: 'string',
  fileTypes: [
    {
      name: 'nii',
      iconClass: 'jp-MaterialIcon mimerenderer-nii-icon',
      mimeTypes: [MIME_TYPE,MIME_TYPE2,MIME_TYPE3],
      fileFormat:'base64',
      extensions: ['.nii.gz','.nii'],
    },
  ],
  documentWidgetFactoryOptions: {
    name: 'NiiViewer',
    primaryFileType: 'nii',
    modelName:'base64',
    fileTypes: ['niigz','nii'],
    defaultFor: ['niigz','nii'],
  },
};

export default extension;
