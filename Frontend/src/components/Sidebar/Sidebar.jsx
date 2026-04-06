import { Drawer } from '@mui/material';
import SidebarInfo from '../SidebarInfo/SidebarInfo';
import style from './Sidebar.module.scss'

function Sidebar({ isDrawer, open, onClose }) {

  // console.log(isDrawer)
  return (
    <>
      {
        isDrawer ?

          <Drawer className={style['sidebar-drawer']} PaperProps={{
            sx: { width: '260px' }
          }} open={open} onClose={onClose}>
            <SidebarInfo
              isDrawer={isDrawer}
              onClose={onClose}
            />

          </Drawer >
          :
          <div className={style['sidebar-container']}>
            <SidebarInfo
              isDrawer={isDrawer}
            />
          </div >
      }
    </>
  )
}

export default Sidebar
