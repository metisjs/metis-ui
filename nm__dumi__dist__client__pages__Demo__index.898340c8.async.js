"use strict";(self.webpackChunkmetis_ui=self.webpackChunkmetis_ui||[]).push([[1009],{77128:function(O,i,e){e.r(i),e.d(i,{default:function(){return E}});var o=e(79786),n=e(75271),D=e(90594),g=function(){var R=(0,o.useParams)(),t=R.id,a=(0,o.useDemo)(t),h=(0,D.m)({id:t,component:a.component,renderOpts:a.renderOpts}),w=h.canvasRef,m=a||{},v=m.component,d=m.renderOpts,r=(0,o.useLiveDemo)(t),s=r.node,c=r.setSource,u=r.error,f=r.loading,L=s||(d!=null&&d.renderer?(0,n.createElement)("div",{ref:w}):v&&(0,n.createElement)(v));return(0,n.useEffect)(function(){var l=function(p){p.data.type==="dumi.liveDemo.setSource"&&c(p.data.value)};return window.addEventListener("message",l),function(){return window.removeEventListener("message",l)}},[c]),(0,n.useEffect)(function(){!f&&(u||s)&&window.postMessage({type:"dumi.liveDemo.compileDone",value:{err:u}})},[u,s,f]),L},E=g}}]);
