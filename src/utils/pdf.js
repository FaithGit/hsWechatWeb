import html2Canvas from "html2canvas";
import JsPDF from "jspdf";

export default {
  install(Vue, options) {
    Vue.prototype.getPdf = function (vvv) {
      let targetDom = document.getElementById("queBox");
      let domScrollHeight = targetDom.scrollHeight;
      targetDom.setAttribute("style", `height: ${domScrollHeight}px;`);
      html2Canvas(targetDom, {
        allowTaint: true,
        taintTest: false,
      }).then(function (canvas) {
        let contentWidth = canvas.width;
        let contentHeight = canvas.height;
        let a4Height = 841.89;
        let a4Width = 595.28;
        let per = (contentWidth / a4Width) * 0.75; //这个主要是为了防止宽度不够的
        //一页pdf显示html页面生成的canvas高度;
        let pageHeight = (contentWidth / a4Width) * a4Height;
        //未生成pdf的html页面高度
        let leftHeight = contentHeight;
        //一页pdf显示html页面生成的canvas高度;
        var a4HeightRef = Math.floor((canvas.width / a4Width) * a4Height);
        //页面偏移
        let position = 0;
        //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
        let imgWidth = a4Width;
        let imgHeight = (a4Width / contentWidth) * contentHeight;
        let pageData = canvas.toDataURL("image/jpeg", 1.0);
        let pdf = new JsPDF("", "pt", [a4Width, a4Height]); //不分页
        if (leftHeight < pageHeight) {
          pdf.addImage(pageData, "JPEG", 0, 0, imgWidth, imgHeight);
        } else {
          while (leftHeight > 0) {
            pdf.addImage(pageData, "JPEG", 0, position, imgWidth, imgHeight);
            leftHeight -= pageHeight;
            position -= a4Height;
            //避免添加空白页
            if (leftHeight > 0) {
              pdf.addPage();
            }
          }
        }

        pdf.save(vvv);
        targetDom.setAttribute("style", `height: 700px;`);
      });
    };
  },
};
