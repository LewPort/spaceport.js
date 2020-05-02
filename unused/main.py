import os
import wx
import wx.html2

relpath = os.path.dirname(__file__) + '/'


class MyBrowser(wx.Dialog):
    def __init__(self, *args, **kwargs):
        wx.Dialog.__init__(self, *args, **kwargs)
        sizer = wx.BoxSizer(wx.VERTICAL)
        self.browser = wx.html2.WebView.New(self)
        sizer.Add(self.browser, 1, wx.EXPAND, 10)
        self.SetSizer(sizer)
        self.SetSize((700,700))

if __name__ == '__main__':
    app = wx.App()
    dialog = MyBrowser(None, -1)
    dialog.browser.LoadURL(relpath+'index.html')
    dialog.Show()
    app.MainLoop()
