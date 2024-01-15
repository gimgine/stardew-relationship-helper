import type { DraggableDirective } from '@/models';
import type { DirectiveBinding, ObjectDirective } from 'vue';
const Directive: ObjectDirective<HTMLElement, DraggableDirective> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<DraggableDirective>) {
    const placeholder = document.createElement('div');
    let touchHandled = false; //sometimes mobile will fire both touch and mouse events this prevents both handlers being called

    // mobile
    let touchTimeout: number | undefined = undefined;

    el.ontouchstart = (e) => {
      touchHandled = true;
      const startX = el.getBoundingClientRect().left;
      const startY = el.getBoundingClientRect().top + window.scrollY;
      const clickX = e.touches[0].clientX - startX;
      const clickY = e.touches[0].clientY - startY;
      touchTimeout = setTimeout(() => {
        binding.value.onDragStart?.();
        placeholder.style.minWidth = `${el.clientWidth}px`;
        placeholder.style.minHeight = `${el.clientHeight}px`;
        el.style.position = 'absolute';
        el.style.top = startY + 'px';
        el.style.left = startX + 'px';
        el.style.zIndex = '100';
        el.parentNode?.insertBefore(placeholder, el);
        el.ontouchmove = (ev) => {
          ev.preventDefault();
          binding.value.onDrag?.(ev.touches[0].clientX, ev.touches[0].clientY);
          el.style.top = ev.touches[0].clientY - clickY + 'px';
          el.style.left = ev.touches[0].clientX - clickX + 'px';
        };
        el.ontouchend = () => {
          console.log('touchend');
          binding.value.onDragEnd?.();
          el.style.transition = '300ms';
          el.style.top = startY + 'px';
          el.style.left = startX + 'px';
          let parentNode = el.parentNode;
          setTimeout(() => {
            el.style.position = '';
            el.style.top = '';
            el.style.left = '';
            el.style.transition = '';
            el.style.zIndex = '';
            parentNode?.removeChild(placeholder);
          }, 280);
          el.ontouchend = el.ontouchmove = null;
        };
      }, 500);
      el.ontouchmove = el.ontouchend = () => {
        clearTimeout(touchTimeout);
        el.ontouchend = el.ontouchmove = null;
      };
    };

    // non-mobile
    el.onmousedown = (e) => {
      if (e.button !== 0) return;
      if (!touchHandled) {
        binding.value.onDragStart?.();
        placeholder.style.minWidth = `${el.clientWidth}px`;
        placeholder.style.minHeight = `${el.clientHeight}px`;
        const startX = el.getBoundingClientRect().left;
        const startY = el.getBoundingClientRect().top + window.scrollY;
        const clickX = e.x - startX;
        const clickY = e.y - startY;
        el.style.position = 'absolute';
        el.style.top = startY + 'px';
        el.style.left = startX + 'px';
        el.style.zIndex = '100';
        el.parentNode?.insertBefore(placeholder, el);
        document.onmousemove = (ev) => {
          ev.preventDefault();
          binding.value.onDrag?.(ev.x, ev.y);
          el.style.top = ev.y - clickY + 'px';
          el.style.left = ev.x - clickX + 'px';
        };
        document.onmouseup = () => {
          binding.value.onDragEnd?.();
          el.style.transition = '300ms';
          el.style.top = startY + 'px';
          el.style.left = startX + 'px';
          let parentNode = el.parentNode;
          setTimeout(() => {
            console.log(el.parentNode);
            el.style.position = '';
            el.style.top = '';
            el.style.left = '';
            el.style.transition = '';
            el.style.zIndex = '';
            parentNode?.removeChild(placeholder);
          }, 280);
          document.onmouseup = document.onmousemove = null;
        };
      }
      touchHandled = false;
    };
  },
  unmounted(el: HTMLElement, binding: DirectiveBinding<DraggableDirective>) {
    el.onmousedown = el.ontouchstart = null;
  }
};

export default Directive;
