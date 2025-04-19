/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef, FC, useContext } from 'react'
import { useParams } from 'react-router-dom'
import {
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackLayout,
  SandpackPreview,
  useSandpack,
} from '@codesandbox/sandpack-react'
import { FolderClosed, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'
import {
  getMessages,
  updateEditorMessage,
} from '@/features/Authentication/services'
import { Terminal } from './terminal.component'

export const CodeEditor: FC = () => {
  const { chat_id } = useParams()
  const [isSaveLoading, setIsSaveLoading] = useState(false)
  const [files, setFiles] = useState<Record<string, any>>({})
  const { sandpack } = useSandpack()
  const [sheetOpen, setSheetOpen] = useState(false)
  const fetchedRef = useRef(false)

  // 1) Fetch remote files only once
  useEffect(() => {
    if (!chat_id || fetchedRef.current) return
    fetchedRef.current = true
    ;(async () => {
      try {
        const { data } = await getMessages(chat_id)
        const remote = JSON.parse(data.editor_message.response || '{}')
        console.log('ediiiiiiiiiiiiitor msg')
        console.log(remote)
        setFiles(remote.files || {})
      } catch (err) {
        console.error('Failed to load remote files:', err)
      }
    })()
  }, [chat_id])

  // 2) Update all files in one call
  useEffect(() => {
    Object.entries(files).forEach(([path, file]) => {
      sandpack.updateFile(path, file)
    })
  }, [files, sandpack])

  // 3) Persist changes to DB whenever Sandpack’s “files” changes
  useEffect(() => {
    setIsSaveLoading(true)
    if (!chat_id) return
    setTimeout(() => {
      updateEditorMessage(chat_id, JSON.stringify(sandpack.files))
        .catch((err) => {
          console.error('Failed to sync with DB:', err)
        })
        .finally(() => {
          setIsSaveLoading(false)
        })
    }, 1000)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat_id])

  const onSave = async () => {}

  return (
    <SandpackLayout onResize={() => {}}>
      <div className="h-screen w-full overflow-scroll bg-[#0F0F10]">
        <div className="block sm:hidden">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild className="absolute bottom-5 left-5 z-[100]">
              <Button size="icon" variant="outline">
                <FolderClosed />
              </Button>
            </SheetTrigger>
            <SheetContent className="text-white">
              <div className="h-full overflow-auto mt-4">
                <SandpackFileExplorer className="h-full" />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <ResizablePanelGroup direction="horizontal">
          {/* Hide FileTree on mobile */}
          <ResizablePanel
            defaultSize={25}
            minSize={15}
            className="hidden sm:block"
          >
            <div className="h-full overflow-auto border-l border-gray-700 relative">
              <SandpackFileExplorer className="h-full" />
              <Button
                className="absolute bottom-2 w-full mx-2"
                variant="outline"
                onClick={onSave}
                disabled={isSaveLoading}
              >
                {isSaveLoading ? <Loader2 className="animate-spin" /> : 'Save'}
              </Button>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={75}>
            {/* Add full height class for dynamic vertical resizing */}
            <ResizablePanelGroup direction="vertical" className="h-full">
              <ResizablePanel defaultSize={70} className="">
                <div className="overflow-auto flex flex-col md:flex-row h-full relative">
                  <SandpackCodeEditor
                    wrapContent
                    showTabs={false}
                    showLineNumbers
                    style={{
                      maxWidth: 400,
                      textWrap: 'pretty',
                      wordWrap: 'break-word',
                    }}
                  />
                  <SandpackPreview
                    className="min-w-[540px]"
                    autoSave="save"
                    showNavigator
                    showOpenInCodeSandbox={false}
                  />
                  <Button
                    className="absolute bottom-0"
                    variant="outline"
                    onClick={onSave}
                    disabled={isSaveLoading}
                  >
                    {isSaveLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      'Save'
                    )}
                  </Button>
                </div>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={30} className="overflow-scroll">
                <div className="h-full overflow-auto">
                  <Terminal setFiles={setFiles} />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </SandpackLayout>
  )
}
